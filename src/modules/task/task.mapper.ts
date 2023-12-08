import { Tasks } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { Mapper } from '../../libs/ddd/mapper.interface'
import { TaskResponseDto } from './dtos/task.response.dto'
import { TaskEntity } from './domain/task.entity'

@Injectable()
export class TaskMapper implements Mapper<TaskEntity, Tasks, TaskResponseDto> {
  toPersistence(entity: TaskEntity): Tasks {
    const props = entity.getProps()
    const record: Tasks = {
      id: props.id,
      name: props.name,
      serviceId: props.serviceId,
      serviceName: props.serviceName,
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
    })
    return response
  }
}
