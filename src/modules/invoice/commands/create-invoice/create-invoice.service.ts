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
import { OrderedJobs, OrderedServices, Prisma } from '@prisma/client'
import { MountingTypeEnum, ProjectPropertyTypeEnum } from '../../../project/domain/project.type'

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
      } else if (job && this.isNewResidentialPurePrice(orderedService, job)) {
        if (Number(orderedService.price) > 0) return
        const numberOfNewResidentialServices = await this.calcNumberOfNewResidentialServices(
          orderedServices,
          jobs,
          orderedService.serviceId,
        )

        const cost = await this.calcPriceForNewResidentialJob(
          orderedService.serviceId,
          job.clientOrganizationId,
          job.mountingType,
          numberOfNewResidentialServices,
        )
        orderedService.price = cost
      }
    })

    await Promise.all(calcCost)

    const subTotal = orderedServices.reduce((pre, cur) => {
      return pre + Number(cur.price)
    }, 0)

    /**
     * 1. New Residential Service를 리스트한다. Standard와 현재 가격을 비교한다.
     * 2. 원래 가격과 현재 가격
     *
     * 할인 기준 파악이 필요하다.
     * 1. 볼륨티어만 계산하면 되는가?
     * 2. 볼륨티어 포함한 모든 협상된 가격이 기본가가되고 거기서 메뉴얼하게 수정한것에 대해서 할인가가 되는건가? (그렇다면 서비스별로 원가, 매뉴얼price가 필요하다.)
     */
    const discount = await this.calcDiscountAmount(orderedServices, jobs)

    const entity = InvoiceEntity.create({
      ...command,
      subTotal,
      discount,
      total: subTotal - discount,
    })

    await this.invoiceRepo.insert(entity)

    await Promise.all(
      jobs.map(async (job) => {
        await this.prismaService.orderedJobs.update({
          where: { id: job.id },
          data: { invoiceId: entity.id },
        })
      }),
    )

    await Promise.all(
      orderedServices.map(async (orderedService) => {
        await this.prismaService.orderedServices.update({
          where: { id: orderedService.id },
          data: { price: orderedService.price },
        })
      }),
    )

    return entity.id
  }

  // 아래의 메서드들은 도메인 서비스가 필요한 케이스인 것 같다.
  private async calcNumberOfNewResidentialServices(
    orderedServices: OrderedServices[],
    jobs: OrderedJobs[],
    serviceId: string,
  ): Promise<number> {
    let count = 0
    for (const orderedService of orderedServices) {
      const job = jobs.find((job) => job.id === orderedService.jobId)
      if (
        orderedService.serviceId === serviceId &&
        job?.projectType === ProjectPropertyTypeEnum.Residential &&
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

  private isNewResidentialService(orderedService: OrderedServices, job: OrderedJobs): boolean {
    return (
      job.projectType === ProjectPropertyTypeEnum.Residential &&
      orderedService.status === OrderedServiceStatusEnum.Completed &&
      !orderedService.isRevision
    )
  }

  private isNewResidentialPurePrice(orderedService: OrderedServices, job: OrderedJobs): boolean {
    return (
      job.projectType === ProjectPropertyTypeEnum.Residential &&
      orderedService.status === OrderedServiceStatusEnum.Completed &&
      !orderedService.isRevision &&
      !orderedService.is_manual_price
    )
  }

  private async calcPriceForNewResidentialJob(
    serviceId: string,
    clientOrganizationId: string,
    mountingType: string,
    numberOfNewResidentialServices: number,
  ): Promise<Prisma.Decimal | null> {
    const volumeTiers = await this.prismaService.customResidentialPricingTiers.findMany({
      where: { organizationId: clientOrganizationId, serviceId: serviceId },
    })
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

  private async calcDiscountAmount(orderedServices: OrderedServices[], jobs: OrderedJobs[]) {
    let discountAmount = 0

    const newResidentialServices = orderedServices.filter((orderedService) => {
      const job = jobs.find((job) => job.id === orderedService.jobId)
      if (!job) return false
      return this.isNewResidentialService(orderedService, job)
    })

    /**
     * GM 여부 따져야함!
     */
    for (const orderedService of newResidentialServices) {
      const job = jobs.find((job) => job.id === orderedService.jobId)
      const service = await this.prismaService.service.findUnique({ where: { id: orderedService.serviceId } })

      // gm,base 필드 선택 실수 조심하기.. 리팩토링 필요
      if (job?.mountingType === MountingTypeEnum.Ground_Mount) {
        discountAmount += Number(service?.gmPrice) - Number(orderedService.price)
      } else if (job?.mountingType === MountingTypeEnum.Roof_Mount) {
        discountAmount += Number(service?.basePrice) - Number(orderedService.price)
      }
    }

    return discountAmount
  }
}

/**
 * ADD COULMN
 * Aggregate로 만들면 컬럼추가가 필요없어질수도 있지만, 일단 지금 필요하고, DDD할때 데이터 중복이 트레이드오프라고 알고있음, 그리고 데이터 변경이 잦지 않은 것 위주로.
 * project proeprty type (ordered service, assigned task)
 *
 */

/**
 * 가격 수정은 sent to client가 기준이 아닌, issued를 기준으로? 가격은 결과물 보낸 후에도 수정할수있는것아닌가
 */
