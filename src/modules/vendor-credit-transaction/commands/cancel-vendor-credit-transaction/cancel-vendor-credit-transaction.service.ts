/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'
import { VendorCreditTransactionRepositoryPort as VendorCreditTransactionRepositoryPort } from '../../database/vendor-credit-transaction.repository.port'
import { VENDOR_CREDIT_TRANSACTION_REPOSITORY } from '../../vendor-credit-transaction.di-token'
import { CancelVendorCreditTransactionCommand } from './cancel-vendor-credit-transaction.command'

@CommandHandler(CancelVendorCreditTransactionCommand)
export class CancelVendorCreditTransactionService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(VENDOR_CREDIT_TRANSACTION_REPOSITORY)
    private readonly vendorCreditTransactionRepo: VendorCreditTransactionRepositoryPort,
  ) {}
  async execute(command: CancelVendorCreditTransactionCommand): Promise<void> {
    const entity = await this.vendorCreditTransactionRepo.findOneOrThrow(command.vendorCreditTransactionId)
    entity.cancel()
    await this.vendorCreditTransactionRepo.update(entity)
  }
}
