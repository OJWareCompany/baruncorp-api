import { AssignedTasks } from '@prisma/client'
import { BadRequestException, Injectable } from '@nestjs/common'
import { Mapper } from '../../libs/ddd/mapper.interface'
import { AssignedTaskResponseDto } from './dtos/assigned-task.response.dto'
import { AssignedTaskEntity } from './domain/assigned-task.entity'
import { AssignedTaskStatus } from './domain/assigned-task.type'

@Injectable()
export class AssignedTaskMapper implements Mapper<AssignedTaskEntity, AssignedTasks, AssignedTaskResponseDto> {
  toPersistence(entity: AssignedTaskEntity): AssignedTasks {
    const props = entity.getProps()
    const record: AssignedTasks = {
      id: props.id,
      taskId: props.taskId,
      orderedServiceId: props.orderedServiceId,
      jobId: props.jobId,
      status: props.status,
      assigneeId: props.assigneeId,
      startedAt: props.startedAt,
      doneAt: props.doneAt,
    }
    return record
  }

  toDomain(record: AssignedTasks): AssignedTaskEntity {
    const entity = new AssignedTaskEntity({
      id: record.id,
      props: {
        taskId: record.taskId,
        orderedServiceId: record.orderedServiceId,
        jobId: record.jobId,
        status: record.status as AssignedTaskStatus,
        assigneeId: record.assigneeId,
        startedAt: record.startedAt,
        doneAt: record.doneAt,
      },
    })
    return entity
  }

  toResponse(entity: AssignedTaskEntity): AssignedTaskResponseDto {
    throw new BadRequestException('toResponse doesnt be implemented.')
  }
}
