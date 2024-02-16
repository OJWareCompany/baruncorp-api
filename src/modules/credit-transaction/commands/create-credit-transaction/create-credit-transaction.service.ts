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
import { CreditTransactionTypeEnum } from '../../domain/credit-transaction.type'
import {
  CreditDeductionMissingInvoiceIdException,
  CreditInsufficientException,
} from '../../domain/credit-transaction.error'

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

    /**
     * 인보이스를 크레딧 결제 시 해당 api를 사용한다.
     * 인보이스는 페이먼트와 크레딧을 조회하여 미결제 금액을 계산한다.
     * 인보이스 입금 내역은 페이먼트와 크레딧 두개 내역을 조회하여 날짜순으로 표현한다.
     */
    if (command.creditTransactionType === CreditTransactionTypeEnum.Deduction) {
      if (!command.relatedInvoiceId) {
        throw new CreditDeductionMissingInvoiceIdException()
      }

      const creditHistory = await this.creditTransactionRepo.find(command.clientOrganizationId)
      const creditTotal = creditHistory //
        .filter((credit) => credit.isValid)
        .reduce((pre, cur) => pre + cur.amount, 0)

      if (creditTotal - command.amount < 0) {
        throw new CreditInsufficientException()
      }
    }

    await this.creditTransactionRepo.insert(entity)
    return entity.id
  }
}
