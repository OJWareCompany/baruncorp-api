/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { PrismaService } from '../../../database/prisma.service'
import { EXPENSE_PRICING_REPOSITORY } from '../../expense-pricing.di-token'
import { ExpensePricingEntity } from '../../domain/expense-pricing.entity'
import { CreateExpensePricingCommand } from './create-expense-pricing.command'
import { ExpensePricingRepositoryPort } from '../../database/expense-pricing.repository.port'
import { TaskNotFoundException } from '../../../task/domain/task.error'
import { ExpensePricingConflictException } from '../../domain/expense-pricing.error'

@CommandHandler(CreateExpensePricingCommand)
export class CreateExpensePricingService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(EXPENSE_PRICING_REPOSITORY)
    private readonly expensePricingRepo: ExpensePricingRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}
  async execute(command: CreateExpensePricingCommand): Promise<AggregateID> {
    const task = await this.prismaService.tasks.findUnique({ where: { id: command.taskId } })
    if (!task) throw new TaskNotFoundException()
    const expensePricing = await this.prismaService.expensePricings.findFirst({
      where: { organizationId: command.organizationId, taskId: command.taskId },
    })
    if (expensePricing) throw new ExpensePricingConflictException()
    const entity = ExpensePricingEntity.create({
      ...command,
      taskName: task.name,
    })
    await this.expensePricingRepo.insert(entity)
    return entity.id
  }
}
