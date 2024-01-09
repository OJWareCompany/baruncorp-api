/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { ASSIGNED_TASK_REPOSITORY } from '../../../assigned-task/assigned-task.di-token'
import { AssignedTaskRepositoryPort } from '../../../assigned-task/database/assigned-task.repository.port'
import { OrderedServiceEntity } from '../ordered-service.entity'
import { AssignedTaskStatusEnum } from '../../../assigned-task/domain/assigned-task.type'

export class OrderedServiceCompletionCheckDomainService {
  constructor(
    // @ts-ignore
    @Inject(ASSIGNED_TASK_REPOSITORY) private readonly assignedTaskRepo: AssignedTaskRepositoryPort,
  ) {}

  async isAllRelatedTasksCompleted(orderedService: OrderedServiceEntity) {
    const relatedTasks = await this.assignedTaskRepo.find({ orderedServiceId: orderedService.id })
    return relatedTasks.every((task) => task.status === AssignedTaskStatusEnum.Completed)
  }
}
