import { Inject } from '@nestjs/common'
import { AssignedTaskRepositoryPort } from '../../../assigned-task/database/assigned-task.repository.port'
import { ASSIGNED_TASK_REPOSITORY } from '../../../assigned-task/assigned-task.di-token'
import { AssignedTaskStatusEnum } from '../../../assigned-task/domain/assigned-task.type'
import { OrderedScopeStatus, OrderedServiceStatusEnum } from '../ordered-service.type'
import { OrderedServiceEntity } from '../ordered-service.entity'

export class DetermineOrderedServiceStatus {
  constructor(@Inject(ASSIGNED_TASK_REPOSITORY) private readonly assignedTaskRepo: AssignedTaskRepositoryPort) {}

  async determine(orderedService: OrderedServiceEntity): Promise<OrderedScopeStatus> {
    const assignedTasks = await this.assignedTaskRepo.find({ orderedServiceId: orderedService.id })

    const isNotStarted = assignedTasks.every((task) => task.status === AssignedTaskStatusEnum.Not_Started)
    if (isNotStarted) {
      return OrderedServiceStatusEnum.Not_Started
    }

    const isInProgress = assignedTasks.some((task) => task.status === AssignedTaskStatusEnum.In_Progress)
    if (isInProgress) {
      return OrderedServiceStatusEnum.In_Progress
    }

    const isCompleted = assignedTasks.every((task) => task.status === AssignedTaskStatusEnum.Completed)
    if (isCompleted) {
      return OrderedServiceStatusEnum.Completed
    }

    /**
     * 태스크를 Hold하는 것이 아닌, Scope를 Hold 하도록 한다.
     */
    // const isOnHold = assignedTasks.every((task) => task.status === AssignedTaskStatusEnum.On_Hold)
    // if (isOnHold) {
    //   return AutoOnlyOrderedServiceStatusEnum.On_Hold
    // }

    /**
     * 태스크를 취소하는 것이 아닌, Scope를 Canceled 하도록 한다.
     * 1. 태스크가 전부 취소 상태일 때 인보이스 여부를 알 수 없다.
     */
    // const isCanceled = assignedTasks.every((task) => task.status === AssignedTaskStatusEnum.Canceled)
    // if (isCanceled) {
    //   return OrderedServiceStatusEnum.Canceled
    // }

    return orderedService.status
  }
}
