import { QueryBus } from '@nestjs/cqrs'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { Controller, Get, HttpStatus, Query, UseGuards } from '@nestjs/common'
import { OrderedJobs } from '@prisma/client'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { UserEntity } from '../../../users/domain/user.entity'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { JobPaginatedResponseDto } from '../../dtos/job.paginated.response.dto'
import { FindMyOrderedJobPaginatedQuery } from './find-my-ordered-jobs.paginated.query-handler'
import { FindMyOrderedJobPaginatedRequestDto } from './find-my-ordered-jobs.paginated.request.dto'
import { JobResponseMapper } from '../../job.response.mapper'

@Controller('my-ordered-jobs')
export class FindMyOrderedJobPaginatedHttpController {
  constructor(private readonly queryBus: QueryBus, private readonly jobResponseMapper: JobResponseMapper) {}

  @Get('')
  @ApiOperation({ summary: 'Find My ordered jobs.' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: JobPaginatedResponseDto,
  })
  @UseGuards(AuthGuard)
  async findJob(
    @User() user: UserEntity,
    @Query() queryParams: PaginatedQueryRequestDto,
    @Query() request: FindMyOrderedJobPaginatedRequestDto,
  ): Promise<JobPaginatedResponseDto> {
    const query = new FindMyOrderedJobPaginatedQuery({
      page: queryParams.page,
      limit: queryParams.limit,
      userId: user.id,
      jobStatus: request.jobStatus,
      projectNumber: request.projectNumber,
      jobName: request.jobName,
      propertyFullAddress: request.propertyFullAddress,
      projectPropertyType: request.projectPropertyType,
      mountingType: request.mountingType,
      isExpedited: request.isExpedited,
      propertyOwner: request.propertyOwner,
      inReview: request.inReview,
      priority: request.priority,
    })

    const result: Paginated<OrderedJobs> = await this.queryBus.execute(query)

    return new JobPaginatedResponseDto({
      ...result,
      items: await Promise.all(
        result.items.map(async (job) => {
          return await this.jobResponseMapper.toResponse(job)
        }),
      ),
    })
  }
}
