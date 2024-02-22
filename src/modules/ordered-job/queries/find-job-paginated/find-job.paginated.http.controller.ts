import { Controller, Get, HttpStatus, Query } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { JobPaginatedResponseDto } from '../../dtos/job.paginated.response.dto'
import { FindJobPaginatedQuery } from './find-job.paginated.query-handler'
import { FindJobPaginatedRequestDto } from './find-job.paginated.request.dto'
import { OrderedJobs } from '@prisma/client'
import { JobResponseMapper } from '../../job.response.mapper'

@Controller('jobs')
export class FindJobPaginatedHttpController {
  constructor(private readonly queryBus: QueryBus, private readonly jobResponseMapper: JobResponseMapper) {}

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
      page: queryParams.page,
      limit: queryParams.limit,
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
