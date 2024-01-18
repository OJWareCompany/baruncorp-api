/* eslint-disable @typescript-eslint/ban-ts-comment */
import { OnEvent } from '@nestjs/event-emitter'
import { CalculateVendorCostDomainService } from '../../domain/calculate-vendor-cost.domain-service'
import { Inject } from '@nestjs/common'
import { ASSIGNED_TASK_REPOSITORY } from '../../assigned-task.di-token'
import { AssignedTaskRepositoryPort } from '../../database/assigned-task.repository.port'
import { ORDERED_SERVICE_REPOSITORY } from '../../../ordered-service/ordered-service.di-token'
import { OrderedServiceRepositoryPort } from '../../../ordered-service/database/ordered-service.repository.port'
import { EXPENSE_PRICING_REPOSITORY } from '../../../expense-pricing/expense-pricing.di-token'
import { ExpensePricingRepositoryPort } from '../../../expense-pricing/database/expense-pricing.repository.port'
import { AssignedTaskAssignedDomainEvent } from '../../domain/events/assigned-task-assigned.domain-event'
import { USER_REPOSITORY } from '../../../users/user.di-tokens'
import { UserRepositoryPort } from '../../../users/database/user.repository.port'
import { OrderModificationValidatorDomainService } from '../../../ordered-job/domain/domain-services/order-modification-validator.domain-service'

export class UpdateCostWhenTaskIsAssignedDomainEventHandler {
  constructor(
    // @ts-ignore
    @Inject(ASSIGNED_TASK_REPOSITORY) private readonly assignedTaskRepo: AssignedTaskRepositoryPort,
    // @ts-ignore
    @Inject(ORDERED_SERVICE_REPOSITORY) private readonly orderedServiceRepo: OrderedServiceRepositoryPort,
    // @ts-ignore
    @Inject(EXPENSE_PRICING_REPOSITORY) private readonly expensePricingRepo: ExpensePricingRepositoryPort,
    // @ts-ignore
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryPort,
    private readonly calculateVendorCostDomainService: CalculateVendorCostDomainService,
    private readonly orderModificationValidator: OrderModificationValidatorDomainService,
  ) {}
  @OnEvent([AssignedTaskAssignedDomainEvent.name])
  async handle(event: AssignedTaskAssignedDomainEvent) {
    const assignedTask = await this.assignedTaskRepo.findOneOrThrow(event.aggregateId)
    const orderedService = await this.orderedServiceRepo.findOneOrThrow(assignedTask.orderedServiceId)
    const user = await this.userRepo.findOneByIdOrThrow(event.assigneeUserId)
    const expensePricing = await this.expensePricingRepo.findOneOrThrow(
      user.getProps().organization.id,
      assignedTask.taskId,
    )
    await assignedTask.updateCost(
      this.calculateVendorCostDomainService,
      expensePricing,
      orderedService,
      this.orderModificationValidator,
    )
    await this.assignedTaskRepo.update(assignedTask)
  }
}
