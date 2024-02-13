/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { OrganizationRepositoryPort } from '../../../organization/database/organization.repository.port'
import { ORGANIZATION_REPOSITORY } from '../../../organization/organization.di-token'
import { TaskNotFoundException } from '../../../task/domain/task.error'
import { PrismaService } from '../../../database/prisma.service'
import { ExpensePricingRepositoryPort } from '../../database/expense-pricing.repository.port'
import { ExpensePricingDomainService } from '../../domain/expense-pricing.domain-service'
import { EXPENSE_PRICING_REPOSITORY } from '../../expense-pricing.di-token'
import { ExpensePricingEntity } from '../../domain/expense-pricing.entity'
import {
  ExpensePricingAdministrationCreationException,
  ExpensePricingConflictException,
} from '../../domain/expense-pricing.error'
import { CreateExpensePricingCommand } from './create-expense-pricing.command'

@CommandHandler(CreateExpensePricingCommand)
export class CreateExpensePricingService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(EXPENSE_PRICING_REPOSITORY) private readonly expensePricingRepo: ExpensePricingRepositoryPort,
    // @ts-ignore
    @Inject(ORGANIZATION_REPOSITORY) private readonly organizationRepo: OrganizationRepositoryPort,
    private readonly expensePricingDomainService: ExpensePricingDomainService,
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

    const organization = await this.organizationRepo.findOneOrThrow(command.organizationId)

    if (!this.expensePricingDomainService.isValidForCreation(organization, entity)) {
      throw new ExpensePricingAdministrationCreationException()
    }

    await this.expensePricingRepo.insert(entity)
    return entity.id
  }
}
