import { Controller, Get, HttpStatus, Query } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { JobResponseDto, OrderedTaskResponseFields } from '../../dtos/job.response.dto'
import { JobProps } from '../../domain/job.type'
import { FindJobPaginatedQuery } from './find-job.paginated.query-handler'
import { FindJobPaginatedRequestDto } from './find-job.paginated.request.dto'
import { JobPaginatedResponseDto, JobPaginatedResponseFields } from '../../dtos/job.paginated.response.dto'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PaginatedQueryRequestDto } from '../../../../libs/ddd/paginated-query.request.dto'

@Controller('jobs')
export class FindJobPaginatedHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @ApiOperation({ summary: 'Find job' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: JobResponseDto,
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
        item.propertyAddress = job.propertyAddress
        item.jobRequestNumber = job.jobRequestNumber
        item.mountingType = job.mountingType
        item.jobNumber = job.jobNumber
        item.jobStatus = job.jobStatus
        item.projectType = job.mountingType
        item.receivedAt = job.receivedAt.toISOString()
        item.clientInfo = {
          clientOrganizationId: job.clientInfo.clientId,
          clientOrganizationName: job.clientInfo.clientContact, // TODO: project나 조직도 join 해야하나
        }
        item.orderedTasks = job.orderedTasks.map((task) => {
          return new OrderedTaskResponseFields({
            id: task.id,
            taskStatus: task.taskStatus,
            taskName: task.taskName,
            assignedTo: {
              userId: task.assignedUserId,
              name: task.assignedTo,
            },
            description: task.description,
          })
        })

        return item
      }),
    })
  }
}
