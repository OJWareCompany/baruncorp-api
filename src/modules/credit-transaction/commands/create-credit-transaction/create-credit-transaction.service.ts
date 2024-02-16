/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { InvoiceRepositoryPort } from '../../../invoice/database/invoice.repository.port'
import { UserRepositoryPort } from '../../../users/database/user.repository.port'
import { INVOICE_REPOSITORY } from '../../../invoice/invoice.di-token'
import { USER_REPOSITORY } from '../../../users/user.di-tokens'
import { CreditTransactionRepositoryPort } from '../../database/credit-transaction.repository.port'
import { CREDIT_TRANSACTION_REPOSITORY } from '../../credit-transaction.di-token'
import { CreditTransactionEntity } from '../../domain/credit-transaction.entity'
import { CreateCreditTransactionCommand } from './create-credit-transaction.command'
import { InvoiceEntity } from '../../../invoice/domain/invoice.entity'
import { ORGANIZATION_REPOSITORY } from '../../../organization/organization.di-token'
import { OrganizationRepositoryPort } from '../../../organization/database/organization.repository.port'

@CommandHandler(CreateCreditTransactionCommand)
export class CreateCreditTransactionService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(CREDIT_TRANSACTION_REPOSITORY) private readonly creditTransactionRepo: CreditTransactionRepositoryPort,
    // @ts-ignore
    @Inject(ORGANIZATION_REPOSITORY) private readonly organizationRepo: OrganizationRepositoryPort,
    // @ts-ignore
    @Inject(INVOICE_REPOSITORY) private readonly invoiceRepo: InvoiceRepositoryPort,
    // @ts-ignore
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryPort,
  ) {}
  async execute(command: CreateCreditTransactionCommand): Promise<AggregateID> {
    const clientOrganization = await this.organizationRepo.findOneOrThrow(command.clientOrganizationId)

    let invoice: InvoiceEntity | null
    if (command.relatedInvoiceId) {
      invoice = await this.invoiceRepo.findOneOrThrow(command.relatedInvoiceId)
    }

    const user = await this.userRepo.findOneByIdOrThrow(command.createdByUserId)

    const entity = CreditTransactionEntity.create({
      clientOrganizationId: clientOrganization.id,
      createdBy: user.userName.fullName,
      createdByUserId: command.createdByUserId,
      amount: command.amount,
      relatedInvoiceId: command.relatedInvoiceId,
      creditTransactionType: command.creditTransactionType,
    })
    await this.creditTransactionRepo.insert(entity)
    return entity.id
  }
}
