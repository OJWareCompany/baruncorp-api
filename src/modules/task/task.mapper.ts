import { Tasks } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { Mapper } from '../../libs/ddd/mapper.interface'
import { TaskResponseDto } from './dtos/task.response.dto'
import { TaskEntity } from './domain/task.entity'
import { LicenseRequiredEnum } from './domain/task.type'

@Injectable()
export class TaskMapper implements Mapper<TaskEntity, Tasks, TaskResponseDto> {
  toPersistence(entity: TaskEntity): Tasks {
    const props = entity.getProps()
    const record: Tasks = {
      id: props.id,
      name: props.name,
      serviceId: props.serviceId,
      serviceName: props.serviceName,
      isAutoAssignment: props.isAutoAssignment,
    }
    return record
  }

  toDomain(record: Tasks): TaskEntity {
    const entity = new TaskEntity({
      id: record.id,
      props: {
        name: record.name,
        serviceId: record.serviceId,
        serviceName: record.serviceName,
        isAutoAssignment: record.isAutoAssignment,
      },
    })
    return entity
  }

  toResponse(entity: TaskEntity): TaskResponseDto {
    const props = entity.getProps()
    const response = new TaskResponseDto({
      id: props.id,
      name: props.name,
      serviceId: props.serviceId,
      serviceName: 'string',
      licenseRequired: LicenseRequiredEnum.structural,
      taskPositions: [],
      prerequisiteTask: [],
      taskWorker: [],
    })
    return response
  }
}
