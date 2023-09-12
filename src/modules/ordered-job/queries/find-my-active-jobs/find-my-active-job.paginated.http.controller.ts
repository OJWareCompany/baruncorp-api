import { QueryBus } from '@nestjs/cqrs'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { Controller, Get, HttpStatus, Query, UseGuards } from '@nestjs/common'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { UserEntity } from '../../../users/domain/user.entity'
import { AuthGuard } from '../../../auth/authentication.guard'
import {
  JobPaginatedResponseDto,
  JobPaginatedResponseFields,
  OrderedTaskPaginatedResponseFields,
} from '../../dtos/job.paginated.response.dto'
import { JobProps } from '../../domain/job.type'
import { FindMyActiveJobPaginatedQuery } from './find-my-active-job.paginated.query-handler'

@Controller('my-active-jobs')
export class FindMyActiveJobPaginatedHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('')
  @ApiOperation({ summary: 'Find My active jobs.' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: JobPaginatedResponseDto,
  })
  @UseGuards(AuthGuard)
  async findJob(
    @User() user: UserEntity,
    @Query() queryParams: PaginatedQueryRequestDto,
  ): Promise<JobPaginatedResponseDto> {
    const query = new FindMyActiveJobPaginatedQuery({
      userId: user.id,
      page: queryParams.page,
      limit: queryParams.limit,
    })

    const result: Paginated<JobProps> = await this.queryBus.execute(query)

    return new JobPaginatedResponseDto({
      ...result,
      items: result.items.map((job) => {
        const item = new JobPaginatedResponseFields()
        item.propertyFullAddress = job.propertyFullAddress
        item.jobRequestNumber = job.jobRequestNumber
        item.mountingType = job.mountingType
        item.jobStatus = job.jobStatus
        item.projectType = job.mountingType
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
