import { Controller, Get, Query } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { FindAssignedTaskSummaryDonePaginatedRequestDto } from './find-assigned-task-summary-done.paginated.request.dto'
import { FindAssignedTaskSummaryDonePaginatedQuery } from './find-assigned-task-summary-done.paginated.query-handler'
import { AssignedTaskSummaryDonePaginatedResponseDto } from '../../dtos/assigned-task-summary-done.paginated.response.dto'
import { AssignedTaskSummaryDoneResponseDto } from '@modules/assigned-task/dtos/assigned-task-summary-done.response.dto'

@Controller('assigned-tasks')
export class FindAssignedTaskSummaryDonePaginatedHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('summary/done')
  async get(
    @Query() request: FindAssignedTaskSummaryDonePaginatedRequestDto,
    @Query() queryParams: PaginatedQueryRequestDto,
  ): Promise<AssignedTaskSummaryDonePaginatedResponseDto> {
    const query: FindAssignedTaskSummaryDonePaginatedQuery = new FindAssignedTaskSummaryDonePaginatedQuery({
      ...request,
      ...queryParams,
    })

    const result: Paginated<AssignedTaskSummaryDoneResponseDto> = await this.queryBus.execute(query)

    return new AssignedTaskSummaryDonePaginatedResponseDto({
      ...queryParams,
      ...result,
      items: result.items,
    })
  }
}
