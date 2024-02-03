import _ from 'lodash'
import { PrismaService } from '../../../database/prisma.service'
import { OrderModificationHistoryOperationEnum } from '../integrated-order-modification-history.type'
import { getModifiedFields } from '../../../../libs/utils/modified-fields.util'
import { JobEntity } from '../../../ordered-job/domain/job.entity'
import { UserEntity } from '../../../users/domain/user.entity'
import { OrderedServiceEntity } from '../../../ordered-service/domain/ordered-service.entity'
import { AssignedTaskEntity } from '../../../assigned-task/domain/assigned-task.entity'
import { AssignedTasks, OrderedJobs, OrderedServices } from '@prisma/client'
import { Injectable } from '@nestjs/common'

type modificationFields = {
  jobId: string
  modifiedAt: Date // 받아와야함
  modifiedBy: string
  entity: 'Job' | 'Scope' | 'Task'
  entityId: string
  scopeOrTaskName: string | null
}

/**
 * 데이터가 변경된 필드를 검색하고 이력 생성에 필요한 데이터를
 * 주문에 관련된 각 엔티티의 방식으로 추출하여
 * 주문 수정 통합 이력을 생성하는 도메인 서비스입니다.
 */
@Injectable()
export class OrderModificationHistoryGenerator {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   *
   * @param entity 수정된 이후의 엔티티를 조회하여 입력해야합니다.
   * @param copyBeforeObj
   * @param copyAfterObj
   * @param editor
   */
  async generate<T>(
    entity: JobEntity | OrderedServiceEntity | AssignedTaskEntity,
    copyBeforeObj: OrderedJobs | OrderedServices | AssignedTasks,
    copyAfterObj: OrderedJobs | OrderedServices | AssignedTasks,
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
    modifiedObjInfo: modificationFields,
  ) {
    const modifiedFields = getModifiedFields(original, modified)
    await Promise.all(
      _.map(modifiedFields, async ({ propertyTitle, before, after }, key) => {
        await prismaService.integratedOrderModificationHistory.create({
          data: {
            ...modifiedObjInfo,
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
