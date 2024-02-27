import { Controller, Get, Query } from '@nestjs/common'
import { AssignedTasks } from '@prisma/client'
import { ApiOperation } from '@nestjs/swagger'
import { QueryBus } from '@nestjs/cqrs'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { MountingTypeEnum, ProjectPropertyTypeEnum } from '../../../project/domain/project.type'
import { AssignedTaskPaginatedResponseDto } from '../../dtos/assigned-task.paginated.response.dto'
import { FindAssignedTaskPaginatedRequestDto } from './find-assigned-task.paginated.request.dto'
import { FindAssignedTaskPaginatedQuery } from './find-assigned-task.paginated.query-handler'
import { PrerequisiteTaskVO } from '../../../ordered-job/domain/value-objects/assigned-task.value-object'

@Controller('assigned-tasks')
export class FindAssignedTaskPaginatedHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('')
  @ApiOperation({ description: 'Assigned Task는 Job 조회를 통해서 하도록 설계하였으나 혹시나해서 구현해둠' })
  async get(
    @Query() request: FindAssignedTaskPaginatedRequestDto,
    @Query() queryParams: PaginatedQueryRequestDto,
  ): Promise<AssignedTaskPaginatedResponseDto> {
    const command = new FindAssignedTaskPaginatedQuery({
      ...request,
      ...queryParams,
    })

    const result: Paginated<AssignedTasks & { prerequisiteTasks: PrerequisiteTaskVO[] }> = await this.queryBus.execute(
      command,
    )

    return new AssignedTaskPaginatedResponseDto({
      ...queryParams,
      ...result,
      items: result.items.map((item) => ({
        id: item.id,
        taskId: item.taskId,
        orderedServiceId: item.orderedServiceId,
        jobId: item.jobId,
        status: item.status,
        description: item.description,
        assigneeId: item.assigneeId,
        assigneeName: item.assigneeName,
        assigneeOrganizationId: item.assigneeOrganizationId,
        assigneeOrganizationName: item.assigneeOrganizationName,
        duration: item.duration ? Number(item.duration) : null,
        startedAt: item.startedAt,
        doneAt: item.doneAt,
        taskName: item.taskName,
        serviceName: item.serviceName,
        projectId: item.projectId,
        organizationId: item.organizationId,
        organizationName: item.organizationName,
        projectPropertyType: item.projectPropertyType as ProjectPropertyTypeEnum,
        mountingType: item.mountingType as MountingTypeEnum,
        cost: item.cost ? Number(item.cost) : null,
        isVendor: item.isVendor,
        vendorInvoiceId: item.vendorInvoiceId,
        serviceId: item.serviceId,
        createdAt: item.created_at,
        prerequisiteTasks: item.prerequisiteTasks,
        jobDescription: item.jobName,
      })),
    })
  }
}
