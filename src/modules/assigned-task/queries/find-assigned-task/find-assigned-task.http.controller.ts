import { Controller, Get, Param } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { AssignedTasks } from '@prisma/client'
import { AssignedTaskResponseDto } from '../../dtos/assigned-task.response.dto'
import { FindAssignedTaskRequestDto } from './find-assigned-task.request.dto'
import { FindAssignedTaskQuery } from './find-assigned-task.query-handler'
import { PrerequisiteTaskVO } from '../../../ordered-job/domain/value-objects/assigned-task.value-object'

@Controller('assigned-tasks')
export class FindAssignedTaskHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':assignedTaskId')
  async get(@Param() request: FindAssignedTaskRequestDto): Promise<AssignedTaskResponseDto> {
    const command = new FindAssignedTaskQuery(request)

    const result: AssignedTasks & { prerequisiteTasks: PrerequisiteTaskVO[] } = await this.queryBus.execute(command)

    return new AssignedTaskResponseDto({
      id: result.id,
      taskId: result.taskId,
      orderedServiceId: result.orderedServiceId,
      jobId: result.jobId,
      status: result.status,
      description: result.description,
      assigneeId: result.assigneeId,
      assigneeName: result.assigneeName,
      assigneeOrganizationId: result.assigneeOrganizationId,
      assigneeOrganizationName: result.assigneeOrganizationName,
      duration: result.duration ? Number(result.duration) : null,
      startedAt: result.startedAt,
      doneAt: result.doneAt,
      taskName: result.taskName,
      serviceName: result.serviceName,
      projectId: result.projectId,
      organizationId: result.organizationId,
      organizationName: result.organizationName,
      projectPropertyType: result.projectPropertyType,
      mountingType: result.mountingType,
      cost: result.cost ? Number(result.cost) : null,
      isManualCost: result.isManualCost,
      isVendor: result.isVendor,
      vendorInvoiceId: result.vendorInvoiceId,
      serviceId: result.serviceId,
      createdAt: result.created_at,
      prerequisiteTasks: result.prerequisiteTasks,
      jobDescription: result.jobName,
    })
  }
}
