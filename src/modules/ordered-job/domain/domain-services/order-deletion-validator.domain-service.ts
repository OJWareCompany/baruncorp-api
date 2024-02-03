/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, Injectable } from '@nestjs/common'
import { AssignedTaskRepositoryPort } from '../../../assigned-task/database/assigned-task.repository.port'
import { ASSIGNED_TASK_REPOSITORY } from '../../../assigned-task/assigned-task.di-token'
import { JobEntity } from '../job.entity'
import { JobIncludingCompletedTaskDeleteException } from '../job.error'
import { OrderedServiceEntity } from '../../../ordered-service/domain/ordered-service.entity'
import { AssignedTaskEntity } from '../../../assigned-task/domain/assigned-task.entity'
import { Prisma } from '@prisma/client'
import { OrderedScopeIncludingCompletedTaskDeleteException } from '../../../ordered-service/domain/ordered-service.error'

@Injectable()
export class OrderDeletionValidator {
  constructor(
    // @ts-ignore
    @Inject(ASSIGNED_TASK_REPOSITORY)
    private readonly assignedTaskRepo: AssignedTaskRepositoryPort,
  ) {}
  async validate(entity: JobEntity | OrderedServiceEntity) {
    const assignedTasks = await this.getRelatedAssignedTasks(entity)
    const isCompletedTask = assignedTasks.filter((assignedTask) => assignedTask.isCompleted)
    this.throwError(isCompletedTask, entity)
  }

  private async getRelatedAssignedTasks(entity: JobEntity | OrderedServiceEntity): Promise<AssignedTaskEntity[]> {
    const whereInput: Prisma.AssignedTasksWhereInput = {
      ...(entity instanceof JobEntity && { jobId: entity.id }),
      ...(entity instanceof OrderedServiceEntity && { orderedServiceId: entity.id }),
    }
    return await this.assignedTaskRepo.find(whereInput)
  }

  private throwError(isCompletedTask: AssignedTaskEntity[], entity: JobEntity | OrderedServiceEntity) {
    if (!!isCompletedTask.length) {
      if (entity instanceof JobEntity) {
        throw new JobIncludingCompletedTaskDeleteException()
      }
      if (entity instanceof OrderedServiceEntity) {
        throw new OrderedScopeIncludingCompletedTaskDeleteException()
      }
    }
  }
}
