import { Controller, Get, Query } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { FindAssignedTaskSummaryInProgressPaginatedRequestDto } from './find-assigned-task-summary-in-progress.paginated.request.dto'
import { FindAssignedTaskSummaryInProgressPaginatedQuery } from './find-assigned-task-summary-in-progress.paginated.query-handler'
import { AssignedTaskSummaryInProgressResponseDto } from '@modules/assigned-task/dtos/assigned-task-summary-in-progress.response.dto'
import { AssignedTaskSummaryInProgressPaginatedResponseDto } from '@modules/assigned-task/dtos/assigned-task-summary-in-progress.paginated.response.dto'

@Controller('assigned-tasks')
export class FindAssignedTaskSummaryInProgressPaginatedHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('summary/in-progress')
  async get(
    @Query() request: FindAssignedTaskSummaryInProgressPaginatedRequestDto,
    @Query() queryParams: PaginatedQueryRequestDto,
  ): Promise<AssignedTaskSummaryInProgressPaginatedResponseDto> {
    const query: FindAssignedTaskSummaryInProgressPaginatedQuery = new FindAssignedTaskSummaryInProgressPaginatedQuery({
      ...request,
      ...queryParams,
    })

    const result: Paginated<AssignedTaskSummaryInProgressResponseDto> = await this.queryBus.execute(query)

    return new AssignedTaskSummaryInProgressPaginatedResponseDto({
      ...queryParams,
      ...result,
      items: result.items,
    })
  }
}
