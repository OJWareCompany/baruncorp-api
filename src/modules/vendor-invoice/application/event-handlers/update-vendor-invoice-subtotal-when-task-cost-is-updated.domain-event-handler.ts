/* eslint-disable @typescript-eslint/ban-ts-comment */
import { OnEvent } from '@nestjs/event-emitter'
import { Inject } from '@nestjs/common'
import { AssignedTaskCostUpdatedDomainEvent } from '../../../assigned-task/domain/events/assigned-task-cost-updated.domain-event'
import { AssignedTaskRepositoryPort } from '../../../assigned-task/database/assigned-task.repository.port'
import { ASSIGNED_TASK_REPOSITORY } from '../../../assigned-task/assigned-task.di-token'
import { VendorInvoiceRepositoryPort } from '../../database/vendor-invoice.repository.port'
import { VENDOR_INVOICE_REPOSITORY } from '../../vendor-invoice.di-token'
import { VendorInvoiceCalculator } from '../../domain/domain-services/vendor-invoice-calculator.domain-service'

export class UpdateVendorInvoiceSubtotalWhenTaskCostIsUpdatedDomainEventHandler {
  constructor(
    // @ts-ignore
    @Inject(VENDOR_INVOICE_REPOSITORY) private readonly vendorInvoiceRepo: VendorInvoiceRepositoryPort,

    @Inject(ASSIGNED_TASK_REPOSITORY) private readonly assignedTaskRepo: AssignedTaskRepositoryPort,
    private readonly vendorInvoiceCalculator: VendorInvoiceCalculator,
  ) {}
  @OnEvent(AssignedTaskCostUpdatedDomainEvent.name, { async: true, promisify: true })
  async handle(event: AssignedTaskCostUpdatedDomainEvent) {
    const assignedTask = await this.assignedTaskRepo.findOneOrThrow(event.aggregateId)
    const vendorInvoiceId = assignedTask.getProps().vendorInvoiceId
    if (!vendorInvoiceId) return

    const vendorInvoice = await this.vendorInvoiceRepo.findOneOrThrow(vendorInvoiceId)
    const assignedTasks = await this.assignedTaskRepo.find({ vendorInvoiceId: vendorInvoice.id })

    const subtotal = assignedTasks.reduce((pre, cur) => {
      return pre + Number(cur.getProps().cost)
    }, 0)
    await vendorInvoice.setSubtotal(subtotal, this.vendorInvoiceCalculator)
    await this.vendorInvoiceRepo.update(vendorInvoice)
  }
}
