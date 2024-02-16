/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { InvoiceRepositoryPort } from '../../../invoice/database/invoice.repository.port'
import { INVOICE_REPOSITORY } from '../../../invoice/invoice.di-token'
import { InvoiceCalculator } from '../../../invoice/domain/domain-services/invoice-calculator.domain-service'
import { PaymentOverException, UnissuedInvoicePayException, ZeroPaymentException } from '../../domain/payment.error'
import { PaymentRepositoryPort } from '../../database/payment.repository.port'
import { PAYMENT_REPOSITORY } from '../../payment.di-token'
import { PaymentEntity } from '../../domain/payment.entity'
import { CreatePaymentCommand } from './create-payment.command'

@CommandHandler(CreatePaymentCommand)
export class CreatePaymentService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(PAYMENT_REPOSITORY) private readonly paymentRepo: PaymentRepositoryPort, // @ts-ignore
    // @ts-ignore
    @Inject(INVOICE_REPOSITORY) private readonly invoiceRepo: InvoiceRepositoryPort, // @ts-ignore
    private readonly invoiceCalculator: InvoiceCalculator,
  ) {}
  async execute(command: CreatePaymentCommand): Promise<AggregateID> {
    if (command.amount <= 0) throw new ZeroPaymentException()

    const entity = PaymentEntity.create({
      ...command,
    })

    const invoice = await this.invoiceRepo.findOneOrThrow(command.invoiceId)
    if (invoice.status === 'Unissued') {
      throw new UnissuedInvoicePayException()
    }

    const { isValid, exceededAmount } = await this.invoiceCalculator.isValidAmount(invoice, command.amount)
    if (!isValid) {
      throw new PaymentOverException(exceededAmount)
    }

    await this.paymentRepo.insert(entity)
    return entity.id
  }
}
