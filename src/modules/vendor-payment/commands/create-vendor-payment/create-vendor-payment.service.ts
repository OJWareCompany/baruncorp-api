/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { VendorInvoiceRepositoryPort } from '../../../vendor-invoice/database/vendor-invoice.repository.port'
import { VENDOR_INVOICE_REPOSITORY } from '../../../vendor-invoice/vendor-invoice.di-token'
import { VendorInvoiceCalculator } from '../../../vendor-invoice/domain/domain-services/vendor-invoice-calculator.domain-service'
import { VendorPaymentOverException, ZeroPaymentException } from '../../domain/vendor-payment.error'
import { VendorPaymentRepositoryPort } from '../../database/vendor-payment.repository.port'
import { VENDOR_PAYMENT_REPOSITORY } from '../../vendor-payment.di-token'
import { VendorPaymentEntity } from '../../domain/vendor-payment.entity'
import { CreateVendorPaymentCommand } from './create-vendor-payment.command'

@CommandHandler(CreateVendorPaymentCommand)
export class CreateVendorPaymentService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(VENDOR_PAYMENT_REPOSITORY)
    private readonly vendorPaymentRepo: VendorPaymentRepositoryPort,
    // @ts-ignore
    @Inject(VENDOR_INVOICE_REPOSITORY)
    private readonly vendorInvoiceRepo: VendorInvoiceRepositoryPort,
    private readonly vendorInvoiceCalculator: VendorInvoiceCalculator,
  ) {}
  async execute(command: CreateVendorPaymentCommand): Promise<AggregateID> {
    const entity = VendorPaymentEntity.create({
      ...command,
    })

    if (command.amount <= 0) throw new ZeroPaymentException()

    const vendorInvoice = await this.vendorInvoiceRepo.findOneOrThrow(command.vendorInvoiceId)
    // if (vendorInvoice.status === 'Unissued') {
    //   throw new UnissuedInvoicePayException()
    // }

    const { isValid, exceededAmount } = await this.vendorInvoiceCalculator.isValidAmount(vendorInvoice, command.amount)
    if (!isValid) throw new VendorPaymentOverException(exceededAmount)

    await this.vendorPaymentRepo.insert(entity)

    return entity.id
  }
}
