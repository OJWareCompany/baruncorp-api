import { AssigningTaskAlerts } from '@prisma/client'
import { Mapper } from '../../libs/ddd/mapper.interface'
import { AssigningTaskAlertEntity } from './domain/assigning-task-alert.entity'
import { AssigningTaskAlertProps } from './domain/assigning-task-alert.type'
import { MountingTypeEnum, ProjectPropertyTypeEnum } from '../project/domain/project.type'
import { Injectable } from '@nestjs/common'

@Injectable()
export class AssigningTaskAlertsMapper implements Mapper<AssigningTaskAlertEntity, AssigningTaskAlerts, any> {
  toPersistence(entity: AssigningTaskAlertEntity): AssigningTaskAlerts {
    const props = entity.getProps()
    const record: AssigningTaskAlerts = {
      id: props.id,
      userId: props.userId,
      userName: props.userName,
      jobId: props.jobId,
      assignedTaskId: props.assignedTaskId,
      taskName: props.taskName,
      projectPropertyType: props.projectPropertyType,
      mountingType: props.mountingType,
      isRevision: props.isRevision,
      note: props.note,
      createdAt: props.createdAt,
      isCheckedOut: props.isCheckedOut,
    }
    return record
  }

  toDomain(record: AssigningTaskAlerts): AssigningTaskAlertEntity {
    const props: AssigningTaskAlertProps = {
      userId: record.userId,
      userName: record.userName,
      jobId: record.jobId,
      assignedTaskId: record.assignedTaskId,
      taskName: record.taskName,
      projectPropertyType: record.projectPropertyType as ProjectPropertyTypeEnum,
      mountingType: record.mountingType as MountingTypeEnum,
      isRevision: record.isRevision,
      note: record.note,
      isCheckedOut: record.isCheckedOut,
    }

    const entity = new AssigningTaskAlertEntity({
      id: record.id,
      createdAt: record.createdAt,
      props,
    })

    return entity
  }

  toResponse(entity: AssigningTaskAlertEntity, ...dtos: any) {
    throw new Error('Method not implemented.')
  }
}
