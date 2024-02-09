import { Controller, Get, Query } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { FindAssignedTaskSummaryTotalPaginatedRequestDto } from './find-assigned-task-summary-total.paginated.request.dto'
import { AssignedTaskSummaryDoneResponseDto } from '@modules/assigned-task/dtos/assigned-task-summary-done.response.dto'
import { AssignedTaskSummaryTotalPaginatedResponseDto } from '@modules/assigned-task/dtos/assigned-task-summary-total.paginated.response.dto'
import { FindAssignedTaskSummaryTotalPaginatedQuery } from '@modules/assigned-task/queries/find-assigned-task-summary-total-paginated/find-assigned-task-summary-total.paginated.query-handler'
import { AssignedTaskSummaryTotalResponseDto } from '@modules/assigned-task/dtos/assigned-task-summary-total.response.dto'

@Controller('assigned-tasks')
export class FindAssignedTaskSummaryTotalPaginatedHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('summary/total')
  async get(
    @Query() request: FindAssignedTaskSummaryTotalPaginatedRequestDto,
    @Query() queryParams: PaginatedQueryRequestDto,
  ): Promise<AssignedTaskSummaryTotalPaginatedResponseDto> {
    const query: FindAssignedTaskSummaryTotalPaginatedQuery = new FindAssignedTaskSummaryTotalPaginatedQuery({
      ...request,
      ...queryParams,
    })

    const result: Paginated<AssignedTaskSummaryTotalResponseDto> = await this.queryBus.execute(query)

    return new AssignedTaskSummaryTotalPaginatedResponseDto({
      ...queryParams,
      ...result,
      items: result.items,
    })
  }
}
