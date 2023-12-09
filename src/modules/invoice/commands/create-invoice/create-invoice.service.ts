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
import { PricingTypeEnum } from '../../dtos/invoice.response.dto'
import { OrderedServiceRepositoryPort } from '../../../ordered-service/database/ordered-service.repository.port'
import { ORDERED_SERVICE_REPOSITORY } from '../../../ordered-service/ordered-service.di-token'
import { OrderedServiceEntity } from '../../../ordered-service/domain/ordered-service.entity'
import { CUSTOM_PRICING_REPOSITORY } from '../../../custom-pricing/custom-pricing.di-token'
import { CustomPricingRepositoryPort } from '../../../custom-pricing/database/custom-pricing.repository.port'
import { JOB_REPOSITORY } from '../../../ordered-job/job.di-token'
import { JobRepositoryPort } from '../../../ordered-job/database/job.repository.port'
import { OrderedServiceManager } from '../../../ordered-service/domain/ordered-service-manager.domain-service'
import { CalculateInvoiceService } from '../../domain/calculate-invoice-service.domain-service'
import { ServiceRepositoryPort } from '../../../service/database/service.repository.port'
import { SERVICE_REPOSITORY } from '../../../service/service.di-token'

@CommandHandler(CreateInvoiceCommand)
export class CreateInvoiceService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(INVOICE_REPOSITORY)
    private readonly invoiceRepo: InvoiceRepositoryPort,
    // @ts-ignore
    @Inject(JOB_REPOSITORY)
    private readonly jobRepo: JobRepositoryPort,
    // @ts-ignore
    @Inject(ORDERED_SERVICE_REPOSITORY)
    private readonly orderedServiceRepo: OrderedServiceRepositoryPort,
    // @ts-ignore
    @Inject(CUSTOM_PRICING_REPOSITORY)
    private readonly customPricingRepo: CustomPricingRepositoryPort,
    // @ts-ignore
    @Inject(SERVICE_REPOSITORY)
    private readonly serviceRepo: ServiceRepositoryPort,
    private readonly calcInvoiceService: CalculateInvoiceService,
  ) {}
  async execute(command: CreateInvoiceCommand): Promise<AggregateID> {
    const jobs = await this.jobRepo.findJobsToInvoice(command.clientOrganizationId, command.serviceMonth)
    if (!jobs.length) throw new JobNotFoundException()

    const orderedServices = await this.orderedServiceRepo.findBy(
      'jobId',
      jobs.map((job) => job.id),
    )

    const calcCost = orderedServices.map(
      async (orderedService) =>
        await orderedService.determinePriceWhenInvoice(
          this.calcInvoiceService,
          orderedServices,
          this.customPricingRepo,
        ),
    )

    await Promise.all(calcCost)

    const subTotal = orderedServices.reduce((pre, cur) => {
      return pre + Number(cur.price)
    }, 0)

    const discount = await this.calcInvoiceService.calcDiscountAmount(orderedServices, this.serviceRepo)

    const invoice = InvoiceEntity.create({
      ...command,
      subTotal,
      discount,
      total: subTotal - discount,
    })

    await this.orderedServiceRepo.update(orderedServices)
    await this.jobRepo.update(jobs.map((job) => job.invoice(invoice.id)))
    await this.invoiceRepo.insert(invoice)

    return invoice.id
  }
}

/**
 * 중복 데이터 장점
 * 1. 조회시 매번 계산이 필요한 필드를 해결
 * 2. DB에서 데이터를 볼 때 상위 데이터 이름을 저장하면 보기 편하다.
 *
 * 중복 데이터 단점
 * 1. 단순하게 join하면 되는 데이터는 로직 복잡성을 해결하는것 보다, 상위 데이터가 없데이트 되었을때 같이 업데이트되어야하는 단점이 더 클 수 있다. (id, 이름)
 */
