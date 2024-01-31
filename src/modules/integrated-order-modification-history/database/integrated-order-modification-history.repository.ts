import { Injectable } from '@nestjs/common'
import { IntegratedOrderModificationHistoryRepositoryPort } from './integrated-order-modification-history.repository.port'
import { PrismaService } from '../../database/prisma.service'
import { JobEntity } from '../../ordered-job/domain/job.entity'
import { OrderedServiceEntity } from '../../ordered-service/domain/ordered-service.entity'
import { AssignedTaskEntity } from '../../assigned-task/domain/assigned-task.entity'
import { UserEntity } from '../../users/domain/user.entity'
import { OrderModificationHistoryOperationEnum } from '../domain/integrated-order-modification-history.type'

@Injectable()
export class IntegratedOrderModificationHistoryRepository implements IntegratedOrderModificationHistoryRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async generateCreationHistory(
    entity: JobEntity | OrderedServiceEntity | AssignedTaskEntity,
    editor?: UserEntity | null,
  ) {
    await this.prisma.integratedOrderModificationHistory.create({
      data: {
        entity: this.getEntityName(entity),
        jobId: this.getJobId(entity),
        entityId: entity.id,
        modifiedAt: entity.updatedAt, // 받아와야함
        modifiedBy: editor ? editor.userName.fullName : 'System',
        scopeOrTaskName: this.getScopeOrTaskName(entity),
        attribute: 'Entity',
        operation: OrderModificationHistoryOperationEnum.Create,
        beforeValue: null,
        afterValue: null,
      },
    })
  }

  async generateDeletionHistory(
    entity: JobEntity | OrderedServiceEntity | AssignedTaskEntity,
    editor?: UserEntity | null,
  ) {
    await this.prisma.integratedOrderModificationHistory.create({
      data: {
        entity: this.getEntityName(entity),
        jobId: this.getJobId(entity),
        entityId: entity.id,
        modifiedAt: entity.updatedAt, // 받아와야함
        modifiedBy: editor ? editor.userName.fullName : 'System',
        scopeOrTaskName: this.getScopeOrTaskName(entity),
        attribute: 'Entity',
        operation: OrderModificationHistoryOperationEnum.Delete,
        beforeValue: null,
        afterValue: null,
      },
    })
  }

  private getEntityName(entity: JobEntity | OrderedServiceEntity | AssignedTaskEntity) {
    return entity instanceof JobEntity ? 'Job' : entity instanceof OrderedServiceEntity ? 'Scope' : 'Task'
  }

  private getJobId(entity: JobEntity | OrderedServiceEntity | AssignedTaskEntity) {
    return entity instanceof JobEntity
      ? entity.id
      : entity instanceof OrderedServiceEntity
      ? entity.jobId
      : entity instanceof AssignedTaskEntity
      ? entity.jobId
      : 'None'
  }

  private getScopeOrTaskName(entity: JobEntity | OrderedServiceEntity | AssignedTaskEntity) {
    return entity instanceof JobEntity
      ? null
      : entity instanceof OrderedServiceEntity
      ? entity.getProps().serviceName
      : entity instanceof AssignedTaskEntity
      ? entity.getProps().taskName
      : null
  }
}
