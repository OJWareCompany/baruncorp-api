import { Controller, Get, Param } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { AssignedTasks, OrderedServices, Users } from '@prisma/client'
import { AssignedTaskResponseDto } from '../../dtos/assigned-task.response.dto'
import { FindAssignedTaskRequestDto } from './find-assigned-task.request.dto'
import { FindAssignedTaskQuery } from './find-assigned-task.query-handler'

@Controller('assigned-tasks')
export class FindAssignedTaskHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':assignedTaskId')
  async get(@Param() request: FindAssignedTaskRequestDto): Promise<AssignedTaskResponseDto> {
    const command = new FindAssignedTaskQuery(request)

    const result: AssignedTasks & { user: Users | null; orderedService: OrderedServices } = await this.queryBus.execute(
      command,
    )

    return new AssignedTaskResponseDto({
      id: result.id,
      taskId: result.taskId,
      orderedServiceId: result.orderedServiceId,
      jobId: result.jobId,
      status: result.status,
      description: result.orderedService.description,
      assigneeId: result.assigneeId,
      assigneeName: result.assigneeName,
      duration: result.duration,
      startedAt: result.startedAt,
      doneAt: result.doneAt,
      taskName: result.taskName,
      serviceName: result.serviceName,
      projectId: result.projectId,
      organizationId: result.organizationId,
      organizationName: result.organizationName,
      projectPropertyType: result.projectPropertyType,
      mountingType: result.mountingType,
    })
  }
}
