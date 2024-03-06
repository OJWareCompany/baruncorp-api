/* eslint-disable @typescript-eslint/ban-ts-comment */
import { OnEvent } from '@nestjs/event-emitter'
import { Inject } from '@nestjs/common'
import { GenerateAssignedTaskModificationHistory } from '../../../integrated-order-modification-history/domain/domain-services/assignd-task-modification-history.decorator'
import { OrderedServicePriceUpdatedDomainEvent } from '../../../ordered-service/domain/events/ordered-service-price-updated.domain-event'
import { OrderedServiceRepositoryPort } from '../../../ordered-service/database/ordered-service.repository.port'
import { ExpensePricingRepositoryPort } from '../../../expense-pricing/database/expense-pricing.repository.port'
import { ORDERED_SERVICE_REPOSITORY } from '../../../ordered-service/ordered-service.di-token'
import { EXPENSE_PRICING_REPOSITORY } from '../../../expense-pricing/expense-pricing.di-token'
import { OrderModificationValidator } from '../../../ordered-job/domain/domain-services/order-modification-validator.domain-service'
import { CalculateVendorCostDomainService } from '../../domain/calculate-vendor-cost.domain-service'
import { AssignedTaskRepositoryPort } from '../../database/assigned-task.repository.port'
import { ASSIGNED_TASK_REPOSITORY } from '../../assigned-task.di-token'
import { USER_REPOSITORY } from '../../../users/user.di-tokens'
import { UserRepositoryPort } from '../../../users/database/user.repository.port'
import { DetermineActiveStatusDomainService } from '../../domain/domain-services/determine-active-status.domain-service'

export class UpdateCostWhenOrderedServicePriceIsUpdatedDomainEventHandler {
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
    private readonly activeStatusService: DetermineActiveStatusDomainService,
  ) {}
  @OnEvent(OrderedServicePriceUpdatedDomainEvent.name)
  @GenerateAssignedTaskModificationHistory({ invokedFrom: 'scope', queryScope: null })
  async handle(event: OrderedServicePriceUpdatedDomainEvent) {
    const orderedService = await this.orderedServiceRepo.findOneOrThrow(event.aggregateId)
    const assignedTasks = await Promise.all(
      orderedService.getProps().assignedTasks.map(async (assignedTaskData) => {
        return this.assignedTaskRepo.findOneOrThrow(assignedTaskData.id)
      }),
    )

    const isUpdatedProjectProperty = assignedTasks.some(
      (assignedTask) => assignedTask.projectPropertyType !== orderedService.projectPropertyType,
    )

    if (isUpdatedProjectProperty) {
      for (const assignedTask of assignedTasks) {
        await assignedTask.reset(orderedService.projectPropertyType, this.orderModificationValidator)
        await this.assignedTaskRepo.update(assignedTask)
      }

      for (const assignedTaskAfterReset of assignedTasks) {
        const assignedTask = await this.assignedTaskRepo.findOneOrThrow(assignedTaskAfterReset.id)
        await assignedTask.determineActiveStatus(this.activeStatusService)
        await this.assignedTaskRepo.update(assignedTask)
      }
    } else {
      for (const assignedTask of assignedTasks) {
        const assigneeId = assignedTask.getProps().assigneeId
        if (!assigneeId) continue
        const user = await this.userRepo.findOneById(assigneeId)
        if (!user) continue
        const expensePricing = await this.expensePricingRepo.findOneOrThrow(user.organization.id, assignedTask.taskId)
        await assignedTask.updateCost(
          this.calculateVendorCostDomainService,
          expensePricing,
          orderedService,
          this.orderModificationValidator,
        )
        await this.assignedTaskRepo.update(assignedTask)
      }
    }
  }
}
