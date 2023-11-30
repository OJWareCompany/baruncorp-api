import { Controller, Get, Query } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { AssignedTasks, OrderedServices, Users } from '@prisma/client'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { FindAssignedTaskPaginatedRequestDto } from './find-assigned-task.paginated.request.dto'
import { FindAssignedTaskPaginatedQuery } from './find-assigned-task.paginated.query-handler'
import { AssignedTaskPaginatedResponseDto } from '../../dtos/assigned-task.paginated.response.dto'
import { ApiOperation } from '@nestjs/swagger'

@Controller('assigned-tasks')
export class FindAssignedTaskPaginatedHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('')
  @ApiOperation({ description: 'Assigned Task는 Job 조회를 통해서 하도록 설계하였으나 혹시나해서 구현해둠' })
  async get(
    @Query() request: FindAssignedTaskPaginatedRequestDto,
    @Query() queryParams: PaginatedQueryRequestDto,
  ): Promise<AssignedTaskPaginatedResponseDto> {
    const command = new FindAssignedTaskPaginatedQuery({
      ...request,
      ...queryParams,
    })

    const result: Paginated<AssignedTasks & { user: Users | null; orderedService: OrderedServices }> =
      await this.queryBus.execute(command)

    return new AssignedTaskPaginatedResponseDto({
      ...queryParams,
      ...result,
      items: result.items.map((item) => ({
        id: item.id,
        taskId: item.taskId,
        orderedServiceId: item.orderedServiceId,
        jobId: item.jobId,
        status: item.status,
        description: item.orderedService.description,
        assigneeId: item.assigneeId,
        assigneeName: item.user ? item.user.firstName + ' ' + item.user.lastName : null,
        duration: item.duration,
        startedAt: item.startedAt,
        doneAt: item.doneAt,
      })),
    })
  }
}
