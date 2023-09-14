import { Controller, Get, HttpStatus, Query } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { JobPaginatedResponseDto, JobPaginatedResponseFields } from '../../dtos/job.paginated.response.dto'
import { OrderedTaskPaginatedResponseFields } from '../../dtos/job.paginated.response.dto'
import { JobProps } from '../../domain/job.type'
import { FindJobPaginatedQuery } from './find-job.paginated.query-handler'
import { FindJobPaginatedRequestDto } from './find-job.paginated.request.dto'

@Controller('jobs')
export class FindJobPaginatedHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @ApiOperation({ summary: 'Find job' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: JobPaginatedResponseDto,
  })
  async findJob(
    @Query() request: FindJobPaginatedRequestDto,
    @Query() queryParams: PaginatedQueryRequestDto,
  ): Promise<JobPaginatedResponseDto> {
    const query = new FindJobPaginatedQuery({
      ...request,
      page: queryParams.page,
      limit: queryParams.limit,
    })

    const result: Paginated<JobProps> = await this.queryBus.execute(query)

    return new JobPaginatedResponseDto({
      ...result,
      items: result.items.map((job) => {
        const item = new JobPaginatedResponseFields()
        item.id = job.id
        item.propertyFullAddress = job.propertyFullAddress
        item.jobRequestNumber = job.jobRequestNumber
        item.mountingType = job.mountingType
        item.jobStatus = job.jobStatus
        item.projectType = job.projectType
        item.receivedAt = job.receivedAt.toISOString()
        item.clientInfo = {
          clientOrganizationId: job.clientInfo.clientOrganizationId,
          clientOrganizationName: job.clientInfo.clientOrganizationId, // TODO: project나 조직도 join 해야하나
          clientUserName: job.clientInfo.clientUserName, // TODO: project나 조직도 join 해야하나
          clientUserId: job.clientInfo.clientUserId, // TODO: project나 조직도 join 해야하나
        }
        item.orderedTasks = job.orderedTasks.map((task) => {
          return new OrderedTaskPaginatedResponseFields({
            id: task.id,
            taskStatus: task.taskStatus,
            taskName: task.taskName,
            assignee: {
              userId: task.assigneeUserId,
              name: task.assigneeName,
            },
            description: task.description,
            createdAt: task.createdAt.toISOString(),
          })
        })

        return item
      }),
    })
  }
}
