/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PrismaService } from '../../../database/prisma.service'
import { ExpensePricingRepositoryPort } from '../../database/expense-pricing.repository.port'
import { ExpensePricingNotFoundException } from '../../domain/expense-pricing.error'
import { EXPENSE_PRICING_REPOSITORY } from '../../expense-pricing.di-token'
import { UpdateExpensePricingCommand } from './update-expense-pricing.command'

@CommandHandler(UpdateExpensePricingCommand)
export class UpdateExpensePricingService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(EXPENSE_PRICING_REPOSITORY)
    private readonly expensePricingRepo: ExpensePricingRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}
  async execute(command: UpdateExpensePricingCommand): Promise<void> {
    const entity = await this.expensePricingRepo.findOne(command.organizationId, command.taskId)
    if (!entity) throw new ExpensePricingNotFoundException()
    entity.putUpdate(
      command.resiNewExpenseType,
      command.resiNewValue,
      command.resiRevExpenseType,
      command.resiRevValue,
      command.comNewExpenseType,
      command.comNewValue,
      command.comRevExpenseType,
      command.comRevValue,
    )
    await this.expensePricingRepo.update(entity)
  }
}
