import { Controller, Get, Query } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { FindAssignedTaskSummaryDetailPaginatedRequestDto } from './find-assigned-task-summary-detail.paginated.request.dto'
import { FindAssignedTaskSummaryDetailPaginatedQuery } from '@modules/assigned-task/queries/find-assigned-task-summary-detail-paginated/find-assigned-task-summary-detail.paginated.query-handler'
import { AssignedTaskSummaryDetailResponseDto } from '@modules/assigned-task/dtos/assigned-task-summary-detail.response.dto'
import { AssignedTaskSummaryDetailPaginatedResponseDto } from '@modules/assigned-task/dtos/assigned-task-summary-detail.paginated.response.dto'

@Controller('assigned-tasks')
export class FindAssignedTaskSummaryDetailPaginatedHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('summary/detail')
  async get(
    @Query() request: FindAssignedTaskSummaryDetailPaginatedRequestDto,
    @Query() queryParams: PaginatedQueryRequestDto,
  ): Promise<AssignedTaskSummaryDetailPaginatedResponseDto> {
    const query = new FindAssignedTaskSummaryDetailPaginatedQuery({
      ...request,
      ...queryParams,
    })

    const result: Paginated<AssignedTaskSummaryDetailResponseDto> = await this.queryBus.execute(query)

    return new AssignedTaskSummaryDetailPaginatedResponseDto({
      ...queryParams,
      ...result,
      items: result.items,
    })
  }
}
