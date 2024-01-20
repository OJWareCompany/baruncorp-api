/* eslint-disable @typescript-eslint/ban-ts-comment */
import { OnEvent } from '@nestjs/event-emitter'
import { OrderedServicePriceUpdatedDomainEvent } from '../../../ordered-service/domain/events/ordered-service-price-updated.domain-event'
import { CalculateVendorCostDomainService } from '../../domain/calculate-vendor-cost.domain-service'
import { Inject } from '@nestjs/common'
import { ASSIGNED_TASK_REPOSITORY } from '../../assigned-task.di-token'
import { AssignedTaskRepositoryPort } from '../../database/assigned-task.repository.port'
import { ORDERED_SERVICE_REPOSITORY } from '../../../ordered-service/ordered-service.di-token'
import { OrderedServiceRepositoryPort } from '../../../ordered-service/database/ordered-service.repository.port'
import { EXPENSE_PRICING_REPOSITORY } from '../../../expense-pricing/expense-pricing.di-token'
import { ExpensePricingRepositoryPort } from '../../../expense-pricing/database/expense-pricing.repository.port'
import { OrderModificationValidator } from '../../../ordered-job/domain/domain-services/order-modification-validator.domain-service'

export class UpdateCostWhenOrderedServicePriceIsUpdatedDomainEventHandler {
  constructor(
    // @ts-ignore
    @Inject(ASSIGNED_TASK_REPOSITORY) private readonly assignedTaskRepo: AssignedTaskRepositoryPort,
    // @ts-ignore
    @Inject(ORDERED_SERVICE_REPOSITORY) private readonly orderedServiceRepo: OrderedServiceRepositoryPort,
    // @ts-ignore
    @Inject(EXPENSE_PRICING_REPOSITORY) private readonly expensePricingRepo: ExpensePricingRepositoryPort,
    private readonly calculateVendorCostDomainService: CalculateVendorCostDomainService,
    private readonly orderModificationValidator: OrderModificationValidator,
  ) {}
  @OnEvent(OrderedServicePriceUpdatedDomainEvent.name)
  async handle(event: OrderedServicePriceUpdatedDomainEvent) {
    const orderedService = await this.orderedServiceRepo.findOneOrThrow(event.aggregateId)
    await Promise.all(
      orderedService.getProps().assignedTasks.map(async (task) => {
        const expensePricing = await this.expensePricingRepo.findOneOrThrow(orderedService.organizationId, task.taskId)
        const assignedTask = await this.assignedTaskRepo.findOneOrThrow(task.id)
        await assignedTask.updateCost(
          this.calculateVendorCostDomainService,
          expensePricing,
          orderedService,
          this.orderModificationValidator,
        )
        await this.assignedTaskRepo.update(assignedTask)
      }),
    )
  }
}
