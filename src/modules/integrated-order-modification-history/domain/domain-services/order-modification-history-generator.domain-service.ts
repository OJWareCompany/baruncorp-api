import _ from 'lodash'
import { PrismaService } from '../../../database/prisma.service'
import { OrderModificationHistoryOperationEnum } from '../integrated-order-modification-history.type'
import { getModifiedFields } from '../../../../libs/utils/modified-fields.util'
import { JobEntity } from '../../../ordered-job/domain/job.entity'
import { UserEntity } from '../../../users/domain/user.entity'
import { OrderedServiceEntity } from '../../../ordered-service/domain/ordered-service.entity'
import { AssignedTaskEntity } from '../../../assigned-task/domain/assigned-task.entity'
import { OrderedJobs } from '@prisma/client'
import { Injectable } from '@nestjs/common'

type modificationFields = {
  jobId: string
  modifiedAt: Date // 받아와야함
  modifiedBy: string
  entity: 'Job' | 'Scope' | 'Task'
  entityId: string
  scopeOrTaskName: string | null
}

@Injectable()
export class OrderModificationHistoryGenerator {
  constructor(private readonly prismaService: PrismaService) {}

  async generate<T>(
    entity: JobEntity | OrderedServiceEntity | AssignedTaskEntity,
    copyBeforeObj: OrderedJobs,
    copyAfterObj: OrderedJobs,
    editor?: UserEntity,
  ) {
    const entityName = this.getEntityName(entity)
    const jobId = this.getJobId(entity)
    const scopeOrTaskName = this.getScopeOrTaskName(entity)

    await this.generateOrderModificationHistory(this.prismaService, copyBeforeObj, copyAfterObj, {
      entity: entityName,
      jobId: jobId,
      entityId: entity.id,
      modifiedAt: entity.updatedAt, // 받아와야함
      modifiedBy: editor ? editor.userName.fullName : 'System',
      scopeOrTaskName: scopeOrTaskName,
    })
  }

  private async generateOrderModificationHistory<T>(
    prismaService: PrismaService,
    original: T,
    modified: T,
    modificationFields: modificationFields,
  ) {
    const modifiedFields = getModifiedFields(original, modified)
    await Promise.all(
      _.map(modifiedFields, async ({ propertyTitle, before, after }, key) => {
        await prismaService.integratedOrderModificationHistory.create({
          data: {
            ...modificationFields,
            attribute: propertyTitle,
            operation: OrderModificationHistoryOperationEnum.Update,
            beforeValue: before,
            afterValue: after,
          },
        })
      }),
    )
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
