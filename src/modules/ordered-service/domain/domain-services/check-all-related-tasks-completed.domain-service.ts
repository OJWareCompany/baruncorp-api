/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { ASSIGNED_TASK_REPOSITORY } from '../../../assigned-task/assigned-task.di-token'
import { AssignedTaskRepositoryPort } from '../../../assigned-task/database/assigned-task.repository.port'
import { OrderedServiceEntity } from '../ordered-service.entity'
import { OrderedServiceStatusEnum } from '../ordered-service.type'
import { OrderedServiceCompletableException } from '../ordered-service.error'

export class OrderedScopeStatusChangeValidator {
  constructor(
    // @ts-ignore
    @Inject(ASSIGNED_TASK_REPOSITORY) private readonly assignedTaskRepo: AssignedTaskRepositoryPort,
  ) {}

  async validate(scope: OrderedServiceEntity, scopeStatusEnum: OrderedServiceStatusEnum): Promise<void> {
    switch (scopeStatusEnum) {
      case OrderedServiceStatusEnum.Completed:
        await this.isScopeCompletable(scope)
        break
      default:
        break
    }
  }

  private async isScopeCompletable(scope: OrderedServiceEntity) {
    const internalTasks = await this.assignedTaskRepo.find({ orderedServiceId: scope.id })
    const isAllCompleted = internalTasks.every((internalTask) => internalTask.isCompleted)
    if (!isAllCompleted) throw new OrderedServiceCompletableException()
  }
}
