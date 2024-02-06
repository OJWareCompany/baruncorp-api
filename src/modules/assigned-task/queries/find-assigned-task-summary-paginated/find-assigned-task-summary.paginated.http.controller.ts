import { Controller, Get, Query } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { FindAssignedTaskSummaryPaginatedRequestDto } from './find-assigned-task-summary.paginated.request.dto'
import { FindAssignedTaskSummaryPaginatedQuery } from './find-assigned-task-summary.paginated.query-handler'
import { AssignedTaskSummaryPaginatedResponseDto } from '../../dtos/assigned-task-summary.paginated.response.dto'
import { AssignedTaskSummaryResponseDto } from '@modules/assigned-task/dtos/assigned-task-summary.response.dto'

@Controller('assigned-tasks')
export class FindAssignedTaskSummaryPaginatedHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('summary/total')
  async get(
    @Query() request: FindAssignedTaskSummaryPaginatedRequestDto,
    @Query() queryParams: PaginatedQueryRequestDto,
  ): Promise<AssignedTaskSummaryPaginatedResponseDto> {
    const query: FindAssignedTaskSummaryPaginatedQuery = new FindAssignedTaskSummaryPaginatedQuery({
      ...request,
      ...queryParams,
    })

    const result: Paginated<AssignedTaskSummaryResponseDto> = await this.queryBus.execute(query)

    return new AssignedTaskSummaryPaginatedResponseDto({
      ...queryParams,
      ...result,
      items: result.items,
    })
  }
}
