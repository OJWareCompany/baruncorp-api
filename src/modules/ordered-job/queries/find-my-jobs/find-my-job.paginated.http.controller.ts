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
import { FindMyJobPaginatedQuery } from './find-my-job.paginated.query-handler'
import { FindMyJobPaginatedRequestDto } from './find-my-job.paginated.request.dto'
import { JobResponseMapper } from '../../job.response.mapper'
import { FindJobPaginatedOrderByRequestDto } from '../find-job-paginated/find-job.paginated.request.dto'

@Controller('my-jobs')
export class FindMyJobPaginatedHttpController {
  constructor(private readonly queryBus: QueryBus, private readonly jobResponseMapper: JobResponseMapper) {}

  @Get('')
  @ApiOperation({ summary: 'Find My jobs.' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: JobPaginatedResponseDto,
  })
  @UseGuards(AuthGuard)
  async findJob(
    @User() user: UserEntity,
    @Query() request: FindMyJobPaginatedRequestDto,
    @Query() orderQuery: FindJobPaginatedOrderByRequestDto,
    @Query() queryParams: PaginatedQueryRequestDto,
  ): Promise<JobPaginatedResponseDto> {
    const query = new FindMyJobPaginatedQuery({
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
      orderBy: orderQuery.sortField &&
        orderQuery.sortDirection && {
          field: orderQuery.sortField,
          param: orderQuery.sortDirection,
        },
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
