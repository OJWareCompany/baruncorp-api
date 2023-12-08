/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { PrismaService } from '../../../database/prisma.service'
import { INVOICE_REPOSITORY } from '../../invoice.di-token'
import { InvoiceEntity } from '../../domain/invoice.entity'
import { CreateInvoiceCommand } from './create-invoice.command'
import { InvoiceRepositoryPort } from '../../database/invoice.repository.port'
import { JobNotFoundException } from '../../../ordered-job/domain/job.error'
import {
  OrderedServiceSizeForRevisionEnum,
  OrderedServiceStatusEnum,
} from '../../../ordered-service/domain/ordered-service.type'
import { CustomResidentialPricingTiers, OrderedServices, Prisma } from '@prisma/client'
import { MountingTypeEnum, ProjectPropertyTypeEnum } from '../../../project/domain/project.type'
import { PricingTypeEnum } from '../../dtos/invoice.response.dto'

@CommandHandler(CreateInvoiceCommand)
export class CreateInvoiceService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(INVOICE_REPOSITORY)
    private readonly invoiceRepo: InvoiceRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}
  async execute(command: CreateInvoiceCommand): Promise<AggregateID> {
    const jobs = await this.invoiceRepo.findJobsToInvoice(command.clientOrganizationId, command.serviceMonth)
    if (!jobs.length) throw new JobNotFoundException()

    const orderedServices = await this.prismaService.orderedServices.findMany({
      where: { jobId: { in: jobs.map((job) => job.id) } },
    })
    console.log(orderedServices)
    /**
     * Canceled = 0원 (취소여도 가격을 입력하길 원한다면?)
     * Completed & Minor = 0원
     * Completed & New Residential Service = Volume tier
     */
    const NO_COST = 0

    const calcCost = orderedServices.map(async (orderedService) => {
      const job = jobs.find((job) => job.id === orderedService.jobId)
      if (this.isCanceledOrMinorCompleted(orderedService)) {
        orderedService.price = new Prisma.Decimal(NO_COST)
      } else if (job && this.isNewResidentialPurePrice(orderedService)) {
        const volumeTiers = await this.prismaService.customResidentialPricingTiers.findMany({
          where: { organizationId: job.clientOrganizationId, serviceId: orderedService.serviceId },
        })
        if (volumeTiers.length <= 1) return
        // Tier 적용 구간
        job.pricingType = PricingTypeEnum.Tiered
        const numberOfNewResidentialServices = await this.calcNumberOfNewResidentialServices(
          orderedServices,
          orderedService.serviceId,
        )
        // Ordered Service에 is Tiered Price 추가하기
        const cost = await this.calcPriceForNewResidentialJob(
          volumeTiers,
          orderedService.mountingType,
          numberOfNewResidentialServices,
        )
        orderedService.price = cost
      }
    })

    await Promise.all(calcCost)

    const subTotal = orderedServices.reduce((pre, cur) => {
      return pre + Number(cur.price)
    }, 0)

    const discount = await this.calcDiscountAmount(orderedServices)

    const entity = InvoiceEntity.create({
      ...command,
      subTotal,
      discount,
      total: subTotal - discount,
    })
    console.log(jobs)
    // await this.invoiceRepo.insert(entity)

    // await Promise.all(
    //   jobs.map(async (job) => {
    //     await this.prismaService.orderedJobs.update({
    //       where: { id: job.id },
    //       data: {
    //         invoiceId: entity.id,
    //         pricingType: job.pricingType,
    //       },
    //     })
    //   }),
    // )

    // await Promise.all(
    //   orderedServices.map(async (orderedService) => {
    //     await this.prismaService.orderedServices.update({
    //       where: { id: orderedService.id },
    //       data: { price: orderedService.price },
    //     })
    //   }),
    // )

    return entity.id
  }

  // 아래의 메서드들은 도메인 서비스가 필요한 케이스인 것 같다.
  private async calcNumberOfNewResidentialServices(
    orderedServices: OrderedServices[],
    serviceId: string,
  ): Promise<number> {
    let count = 0
    for (const orderedService of orderedServices) {
      if (
        orderedService.serviceId === serviceId &&
        orderedService.projectPropertyType === ProjectPropertyTypeEnum.Residential &&
        !orderedService.isRevision
      ) {
        count++
      }
    }
    return count
  }

  private isCanceledOrMinorCompleted(orderedService: OrderedServices): boolean {
    return (
      orderedService.status === OrderedServiceStatusEnum.Canceled ||
      (orderedService.status === OrderedServiceStatusEnum.Completed &&
        orderedService.sizeForRevision === OrderedServiceSizeForRevisionEnum.Minor)
    )
  }

  private isNewResidentialService(orderedService: OrderedServices): boolean {
    return (
      orderedService.projectPropertyType === ProjectPropertyTypeEnum.Residential &&
      orderedService.status === OrderedServiceStatusEnum.Completed &&
      !orderedService.isRevision
    )
  }

  private isNewResidentialPurePrice(orderedService: OrderedServices): boolean {
    return (
      orderedService.projectPropertyType === ProjectPropertyTypeEnum.Residential &&
      orderedService.status === OrderedServiceStatusEnum.Completed &&
      !orderedService.isRevision &&
      !orderedService.isManualPrice
    )
  }

  private async calcPriceForNewResidentialJob(
    volumeTiers: CustomResidentialPricingTiers[],
    mountingType: string,
    numberOfNewResidentialServices: number,
  ): Promise<Prisma.Decimal | null> {
    for (const tier of volumeTiers) {
      if (
        (tier.startingPoint <= numberOfNewResidentialServices && !tier.finishingPoint) ||
        (tier.startingPoint <= numberOfNewResidentialServices &&
          Number(tier.finishingPoint) >= numberOfNewResidentialServices)
      ) {
        return mountingType === MountingTypeEnum.Ground_Mount ? tier.gmPrice : tier.price
      }
    }

    return null
  }

  /**
   * 1. New Residential Service를 리스트한다. Standard와 현재 가격을 비교한다.
   * 2. 원래 가격과 현재 가격
   *
   * 할인 기준 파악이 필요하다.
   * 1. 볼륨티어만 계산하면 되는가?
   * 2. 볼륨티어 포함한 모든 협상된 가격이 기본가가되고 거기서 메뉴얼하게 수정한것에 대해서 할인가가 되는건가? (그렇다면 서비스별로 원가, 매뉴얼price가 필요하다.)
   */
  private async calcDiscountAmount(orderedServices: OrderedServices[]) {
    let discountAmount = 0

    const newResidentialServices = orderedServices.filter((orderedService) => {
      return this.isNewResidentialService(orderedService)
    })

    for (const orderedService of newResidentialServices) {
      const service = await this.prismaService.service.findUnique({ where: { id: orderedService.serviceId } })

      // gm,base 필드 선택 실수 조심하기.. 리팩토링 필요
      if (orderedService.mountingType === MountingTypeEnum.Ground_Mount) {
        discountAmount += Number(service?.gmPrice) - Number(orderedService.price)
      } else if (orderedService.mountingType === MountingTypeEnum.Roof_Mount) {
        discountAmount += Number(service?.basePrice) - Number(orderedService.price)
      }
    }

    return discountAmount
  }
}

/**
 * ADD COLUMN
 * Aggregate로 만들면 컬럼추가가 필요없어질수도 있지만, 일단 지금 필요하고, DDD할때 데이터 중복이 트레이드오프라고 알고있음, 그리고 데이터 변경이 잦지 않은 것 위주로.
 * project proeprty type (ordered service, assigned task)
 *
 */

/**
 * 가격 수정은 sent to client가 기준이 아닌, issued를 기준으로? 가격은 결과물 보낸 후에도 수정할수있는것아닌가
 */

/**
 * Mounting Type은.. 인보이스 할때는 프로젝트가 아닌 Job단위이지만.. command(CRD) 될때는 어쨋든 aggregate로 관리하는게 안전할텐데
 * Domain Service를 만들어서 project aggregate에서 job을
 */

/**
 * 중복 데이터 장점
 * 1. 조회시 매번 계산이 필요한 필드를 해결
 * 2. DB에서 데이터를 볼 때 상위 데이터 이름을 저장하면 보기 편하다.
 *
 * 중복 데이터 단점
 * 1. 단순하게 join하면 되는 데이터는 로직 복잡성을 해결하는것 보다, 상위 데이터가 없데이트 되었을때 같이 업데이트되어야하는 단점이 더 클 수 있다. (id, 이름)
 */
