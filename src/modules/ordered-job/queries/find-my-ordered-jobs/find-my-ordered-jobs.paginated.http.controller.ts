import { QueryBus } from '@nestjs/cqrs'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { Controller, Get, HttpStatus, Query, UseGuards } from '@nestjs/common'
import { AssignedTasks, OrderedJobs, OrderedServices, Service, Tasks, Users } from '@prisma/client'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { UserEntity } from '../../../users/domain/user.entity'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { JobPaginatedResponseDto } from '../../dtos/job.paginated.response.dto'
import { JobMapper } from '../../job.mapper'
import { FindMyOrderedJobPaginatedQuery } from './find-my-ordered-jobs.paginated.query-handler'
import { FindMyOrderedJobPaginatedRequestDto } from './find-my-ordered-jobs.paginated.request.dto'
import { PrismaService } from '../../../database/prisma.service'

@Controller('my-ordered-jobs')
export class FindMyOrderedJobPaginatedHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly prismaService: PrismaService,
    private readonly mapper: JobMapper,
  ) {}

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
      userId: user.id,
      page: queryParams.page,
      limit: queryParams.limit,
      projectNumber: request.projectNumber,
      jobName: request.jobName,
      propertyFullAddress: request.propertyFullAddress,
      projectPropertyType: request.projectPropertyType,
      jobStatus: request.jobStatus,
      mountingType: request.mountingType,
      isExpedited: request.isExpedited,
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
