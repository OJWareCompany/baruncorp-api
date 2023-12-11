/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PrismaService } from '../../../database/prisma.service'
import { ExpensePricingRepositoryPort } from '../../database/expense-pricing.repository.port'
import { ExpensePricingNotFoundException } from '../../domain/expense-pricing.error'
import { EXPENSE_PRICING_REPOSITORY } from '../../expense-pricing.di-token'
import { DeleteExpensePricingCommand } from './delete-expense-pricing.command'

@CommandHandler(DeleteExpensePricingCommand)
export class DeleteExpensePricingService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(EXPENSE_PRICING_REPOSITORY)
    private readonly expensePricingRepo: ExpensePricingRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}
  async execute(command: DeleteExpensePricingCommand): Promise<void> {
    const entity = await this.expensePricingRepo.findOne(command.organizationId, command.taskId)
    if (!entity) throw new ExpensePricingNotFoundException()
    await this.expensePricingRepo.update(entity)
  }
}
