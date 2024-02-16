/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'
import { CreditTransactionRepositoryPort } from '../../database/credit-transaction.repository.port'
import { CREDIT_TRANSACTION_REPOSITORY } from '../../credit-transaction.di-token'
import { CancelCreditTransactionCommand } from './cancel-credit-transaction.command'

@CommandHandler(CancelCreditTransactionCommand)
export class CancelCreditTransactionService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(CREDIT_TRANSACTION_REPOSITORY)
    private readonly creditTransactionRepo: CreditTransactionRepositoryPort,
  ) {}
  async execute(command: CancelCreditTransactionCommand): Promise<void> {
    const entity = await this.creditTransactionRepo.findOneOrThrow(command.creditTransactionId)
    entity.cancel()
    await this.creditTransactionRepo.update(entity)
  }
}
