/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { VendorInvoiceRepositoryPort } from '../../../vendor-invoice/database/vendor-invoice.repository.port'
import { OrganizationRepositoryPort } from '../../../organization/database/organization.repository.port'
import { VENDOR_INVOICE_REPOSITORY } from '../../../vendor-invoice/vendor-invoice.di-token'
import { ORGANIZATION_REPOSITORY } from '../../../organization/organization.di-token'
import { PaymentOverException, ZeroPaymentException } from '../../../payment/domain/payment.error'
import { UserRepositoryPort } from '../../../users/database/user.repository.port'
import { USER_REPOSITORY } from '../../../users/user.di-tokens'
import { VendorCreditTransactionRepositoryPort } from '../../database/vendor-credit-transaction.repository.port'
import { VENDOR_CREDIT_TRANSACTION_REPOSITORY } from '../../vendor-credit-transaction.di-token'
import { VendorCreditTransactionTypeEnum } from '../../domain/vendor-credit-transaction.type'
import { VendorCreditTransactionEntity } from '../../domain/vendor-credit-transaction.entity'
import { VendorCreditCalculator } from '../../domain/domain-services/vendor-credit-calculator.domain-service'
import {
  VendorCreditDeductionMissingInvoiceIdException,
  VendorCreditInsufficientException,
  VendorCreditWrongReloadException,
} from '../../domain/vendor-credit-transaction.error'
import { CreateVendorCreditTransactionCommand } from './create-vendor-credit-transaction.command'
import { VendorInvoiceCalculator } from '../../../vendor-invoice/domain/domain-services/vendor-invoice-calculator.domain-service'

@CommandHandler(CreateVendorCreditTransactionCommand)
export class CreateVendorCreditTransactionService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(VENDOR_CREDIT_TRANSACTION_REPOSITORY)
    private readonly vendorCreditTransactionRepo: VendorCreditTransactionRepositoryPort,
    // @ts-ignore
    @Inject(ORGANIZATION_REPOSITORY) private readonly organizationRepo: OrganizationRepositoryPort,
    // @ts-ignore
    @Inject(VENDOR_INVOICE_REPOSITORY) private readonly vendorInvoiceRepo: VendorInvoiceRepositoryPort,
    // @ts-ignore
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryPort,
    private readonly vendorInvoiceCalculator: VendorInvoiceCalculator,
    private readonly vendorCreditCalculator: VendorCreditCalculator,
  ) {}
  async execute(command: CreateVendorCreditTransactionCommand): Promise<AggregateID> {
    if (command.amount <= 0) throw new ZeroPaymentException()
    if (command.creditTransactionType === VendorCreditTransactionTypeEnum.Reload && command.relatedVendorInvoiceId) {
      throw new VendorCreditWrongReloadException()
    }
    const vendorOrganization = await this.organizationRepo.findOneOrThrow(command.vendorOrganizationId)

    const user = await this.userRepo.findOneByIdOrThrow(command.createdByUserId)

    const entity = VendorCreditTransactionEntity.create({
      vendorOrganizationId: vendorOrganization.id,
      createdBy: user.userName.fullName,
      createdByUserId: command.createdByUserId,
      amount: command.amount,
      relatedVendorInvoiceId: command.relatedVendorInvoiceId,
      creditTransactionType: command.creditTransactionType,
      note: command.note,
    })

    /**
     * 인보이스를 크레딧 결제 시 해당 api를 사용한다.
     * 인보이스는 페이먼트와 크레딧을 조회하여 미결제 금액을 계산한다.
     * 인보이스 입금 내역은 페이먼트와 크레딧 두개 내역을 조회하여 날짜순으로 표현한다.
     */
    if (command.creditTransactionType === VendorCreditTransactionTypeEnum.Deduction) {
      if (!command.relatedVendorInvoiceId) {
        throw new VendorCreditDeductionMissingInvoiceIdException()
      }

      const vendorInvoice = await this.vendorInvoiceRepo.findOneOrThrow(command.relatedVendorInvoiceId)

      const { isValid, exceededAmount } = await this.vendorInvoiceCalculator.isValidAmount(
        vendorInvoice,
        command.amount,
      )
      if (!isValid) {
        throw new PaymentOverException(exceededAmount)
      }

      const { isAfford, insufficientAmount } = await this.vendorCreditCalculator.isAfford(
        command.vendorOrganizationId,
        command.amount,
      )

      if (!isAfford) {
        throw new VendorCreditInsufficientException(insufficientAmount)
      }
    }

    await this.vendorCreditTransactionRepo.insert(entity)
    return entity.id
  }
}
