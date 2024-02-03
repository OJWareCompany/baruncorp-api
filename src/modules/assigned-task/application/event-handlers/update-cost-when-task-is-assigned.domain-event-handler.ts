/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CalculateVendorCostDomainService } from '../../domain/calculate-vendor-cost.domain-service'
import { OnEvent } from '@nestjs/event-emitter'
import { Inject } from '@nestjs/common'
import { GenerateAssignedTaskModificationHistory } from '../../../integrated-order-modification-history/domain/domain-services/assignd-task-modification-history.decorator'
import { OrderedServiceRepositoryPort } from '../../../ordered-service/database/ordered-service.repository.port'
import { ExpensePricingRepositoryPort } from '../../../expense-pricing/database/expense-pricing.repository.port'
import { ORDERED_SERVICE_REPOSITORY } from '../../../ordered-service/ordered-service.di-token'
import { OrderModificationValidator } from '../../../ordered-job/domain/domain-services/order-modification-validator.domain-service'
import { EXPENSE_PRICING_REPOSITORY } from '../../../expense-pricing/expense-pricing.di-token'
import { UserRepositoryPort } from '../../../users/database/user.repository.port'
import { USER_REPOSITORY } from '../../../users/user.di-tokens'
import { AssignedTaskAssignedDomainEvent } from '../../domain/events/assigned-task-assigned.domain-event'
import { AssignedTaskRepositoryPort } from '../../database/assigned-task.repository.port'
import { ASSIGNED_TASK_REPOSITORY } from '../../assigned-task.di-token'

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
    private readonly orderModificationValidator: OrderModificationValidator,
  ) {}

  @OnEvent(AssignedTaskAssignedDomainEvent.name, { async: true, promisify: true })
  @GenerateAssignedTaskModificationHistory({ invokedFrom: 'self', queryScope: null })
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
