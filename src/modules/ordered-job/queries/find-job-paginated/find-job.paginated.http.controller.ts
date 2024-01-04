import { Controller, Get, HttpStatus, Query } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { JobPaginatedResponseDto } from '../../dtos/job.paginated.response.dto'
import { FindJobPaginatedQuery } from './find-job.paginated.query-handler'
import { FindJobPaginatedRequestDto } from './find-job.paginated.request.dto'
import { OrderedJobs, OrderedServices, Service, AssignedTasks, Tasks, Users } from '@prisma/client'
import { JobMapper } from '../../job.mapper'
import { PrismaService } from '../../../database/prisma.service'

@Controller('jobs')
export class FindJobPaginatedHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly prismaService: PrismaService,
    private readonly mapper: JobMapper,
  ) {}

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

    const result: Paginated<
      OrderedJobs & {
        orderedServices: (OrderedServices & {
          service: Service
          assignedTasks: (AssignedTasks & { task: Tasks; user: Users | null })[]
        })[]
      }
    > = await this.queryBus.execute(query)

    const prerequisiteTasks = await this.prismaService.prerequisiteTasks.findMany()

    return new JobPaginatedResponseDto({
      ...result,
      items: result.items.map((job) => {
        const entity = this.mapper.toDomain({ ...job, prerequisiteTasks })
        return this.mapper.toResponse(entity)
      }),
    })
  }
}
