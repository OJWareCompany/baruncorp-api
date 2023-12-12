/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { VENDOR_INVOICE_REPOSITORY } from '../../vendor-invoice.di-token'
import { VendorInvoiceEntity } from '../../domain/vendor-invoice.entity'
import { CreateVendorInvoiceCommand } from './create-vendor-invoice.command'
import { VendorInvoiceRepositoryPort } from '../../database/vendor-invoice.repository.port'
import { OrganizationRepositoryPort } from '../../../organization/database/organization.repository.port'
import { ORGANIZATION_REPOSITORY } from '../../../organization/organization.di-token'
import { ASSIGNED_TASK_REPOSITORY } from '../../../assigned-task/assigned-task.di-token'
import { AssignedTaskRepositoryPort } from '../../../assigned-task/database/assigned-task.repository.port'

@CommandHandler(CreateVendorInvoiceCommand)
export class CreateVendorInvoiceService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(VENDOR_INVOICE_REPOSITORY)
    private readonly vendorInvoiceRepo: VendorInvoiceRepositoryPort,
    // @ts-ignore
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly organizationRepo: OrganizationRepositoryPort,
    // @ts-ignore
    @Inject(ASSIGNED_TASK_REPOSITORY)
    private readonly assignTaskRepo: AssignedTaskRepositoryPort,
  ) {}
  async execute(command: CreateVendorInvoiceCommand): Promise<AggregateID> {
    const organization = await this.organizationRepo.findOneOrThrow(command.organizationId)
    const tasksToInvoice = await this.assignTaskRepo.findToVendorInvoice(command.organizationId, command.serviceMonth)

    const dateDue = new Date()
    dateDue.setDate(dateDue.getDate() + command.terms)

    const entity = VendorInvoiceEntity.create({
      organizationId: command.organizationId,
      organizationName: organization.name,
      daysPastDue: null,
      invoiceDate: command.invoiceDate,
      dateDue: dateDue,
      invoiceNumber: command.invoiceNumber,
      terms: command.terms,
      note: command.note,
      serviceMonth: command.serviceMonth,
      subTotal: tasksToInvoice.reduce((pre, cur) => {
        return pre + Number(cur.getProps().cost)
      }, 0),
      total: tasksToInvoice.reduce((pre, cur) => {
        return pre + Number(cur.getProps().cost)
      }, 0), // TODO
      invoiceTotalDifference: 0, // TODO
      internalTotalBalanceDue: 0, // TODO
    })
    await this.vendorInvoiceRepo.insert(entity)
    return entity.id
  }
}
