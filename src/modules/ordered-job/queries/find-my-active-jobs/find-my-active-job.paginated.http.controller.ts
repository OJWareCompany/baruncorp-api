import { QueryBus } from '@nestjs/cqrs'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { Controller, Get, HttpStatus, Query, UseGuards } from '@nestjs/common'
import { AssignedTasks, OrderedJobs, OrderedServices, Service, Tasks, Users } from '@prisma/client'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { UserEntity } from '../../../users/domain/user.entity'
import { AuthGuard } from '../../../auth/authentication.guard'
import { JobPaginatedResponseDto } from '../../dtos/job.paginated.response.dto'
import { JobMapper } from '../../job.mapper'
import { FindMyActiveJobPaginatedQuery } from './find-my-active-job.paginated.query-handler'

@Controller('my-active-jobs')
export class FindMyActiveJobPaginatedHttpController {
  constructor(private readonly queryBus: QueryBus, private readonly mapper: JobMapper) {}

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

    const result: Paginated<
      OrderedJobs & {
        orderedServices: (OrderedServices & {
          service: Service
          assignedTasks: (AssignedTasks & { task: Tasks; user: Users | null })[]
        })[]
      }
    > = await this.queryBus.execute(query)

    return new JobPaginatedResponseDto({
      ...result,
      items: result.items.map((job) => {
        const entity = this.mapper.toDomain(job)
        return this.mapper.toResponse(entity)
      }),
    })
  }
}
