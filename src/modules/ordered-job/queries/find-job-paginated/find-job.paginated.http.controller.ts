import { Controller, Get, HttpStatus, Query } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { JobPaginatedResponseDto } from '../../dtos/job.paginated.response.dto'
import { FindJobPaginatedQuery } from './find-job.paginated.query-handler'
import { FindJobPaginatedOrderByRequestDto, FindJobPaginatedRequestDto } from './find-job.paginated.request.dto'
import { OrderedJobs } from '@prisma/client'
import { JobResponseMapper } from '../../job.response.mapper'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'

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
    @Query() orderQuery: FindJobPaginatedOrderByRequestDto,
    @Query() queryParams: PaginatedQueryRequestDto,
  ): Promise<JobPaginatedResponseDto> {
    const query = new FindJobPaginatedQuery({
      page: queryParams.page,
      limit: queryParams.limit,
      ...request,
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
