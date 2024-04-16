/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { OrderedServiceRepositoryPort } from '../../../ordered-service/database/ordered-service.repository.port'
import { ORDERED_SERVICE_REPOSITORY } from '../../../ordered-service/ordered-service.di-token'
import { TieredPricingCalculator } from '../../../ordered-service/domain/domain-services/tiered-pricing-calculator.domain-service'
import { ServiceRepositoryPort } from '../../../service/database/service.repository.port'
import { JobNotFoundException } from '../../../ordered-job/domain/job.error'
import { SERVICE_REPOSITORY } from '../../../service/service.di-token'
import { JobRepositoryPort } from '../../../ordered-job/database/job.repository.port'
import { JOB_REPOSITORY } from '../../../ordered-job/job.di-token'
import { CalculateInvoiceService } from '../../domain/calculate-invoice-service.domain-service'
import { InvoiceRepositoryPort } from '../../database/invoice.repository.port'
import { INVOICE_REPOSITORY } from '../../invoice.di-token'
import { ModifyPeriodMonthCommand } from './modify-period-month.command'

@CommandHandler(ModifyPeriodMonthCommand)
export class ModifyPeriodMonthService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(INVOICE_REPOSITORY) private readonly invoiceRepo: InvoiceRepositoryPort, // @ts-ignore
    @Inject(JOB_REPOSITORY) private readonly jobRepo: JobRepositoryPort, // @ts-ignore
    @Inject(ORDERED_SERVICE_REPOSITORY) private readonly orderedServiceRepo: OrderedServiceRepositoryPort, // @ts-ignore
    @Inject(SERVICE_REPOSITORY) private readonly serviceRepo: ServiceRepositoryPort,
    private readonly calcInvoiceService: CalculateInvoiceService,
    private readonly tieredPricingCalculator: TieredPricingCalculator,
  ) {}
  async execute(command: ModifyPeriodMonthCommand): Promise<AggregateID> {
    const existingInvoice = await this.invoiceRepo.findOneOrThrow(command.invoiceId)

    const existingLineItems = await this.jobRepo.findManyBy({ invoiceId: existingInvoice.id })
    existingLineItems.map((item) => item.unInvoice())

    // 2. line item을 새로 찾아서 invoice id를 업데이트한다.
    const newLineItems = await this.jobRepo.findJobsToInvoice(
      existingInvoice.clientOrganizationId,
      command.serviceMonth,
    )
    if (!newLineItems.length) throw new JobNotFoundException()

    // 3. invoice의 정보를 수정한다. (가격, 등)

    const orderedServices = await this.orderedServiceRepo.findBy({ jobId: { in: newLineItems.map((job) => job.id) } })
    const calcCost = orderedServices.map(
      async (orderedService) => await orderedService.determinePriceWhenInvoice(this.tieredPricingCalculator),
    )

    await Promise.all(calcCost)

    const totalTaskPrice = orderedServices.reduce((pre, cur) => {
      return pre + Number(cur.price)
    }, 0) // TODO: Job Override Price가 존재하면 덮어씌운다.

    const volumeTierDiscount = await this.calcInvoiceService.calcDiscountAmount(orderedServices, this.serviceRepo)

    existingInvoice.modifyPeriodMonth(totalTaskPrice, volumeTierDiscount, command.serviceMonth)

    newLineItems.map((newItem) => newItem.invoice(existingInvoice.id))

    await this.jobRepo.update(existingLineItems)
    await this.jobRepo.update(newLineItems)
    await this.orderedServiceRepo.update(orderedServices)
    await this.invoiceRepo.update(existingInvoice)
    return existingInvoice.id
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
