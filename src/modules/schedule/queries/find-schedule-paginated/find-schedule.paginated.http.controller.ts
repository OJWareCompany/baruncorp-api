import { Controller, Get, Query } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { SchedulePaginatedResponseDto } from '@modules/schedule/dtos/schedule.paginated.response.dto'
import { ScheduleResponseDto } from '@modules/schedule/dtos/schedule.response.dto'
import { FindSchedulePaginatedQuery } from '@modules/schedule/queries/find-schedule-paginated/find-schedule.paginated.query-handler'

@Controller('users')
export class FindSchedulePaginatedHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('schedule/total')
  async get(@Query() queryParams: PaginatedQueryRequestDto): Promise<SchedulePaginatedResponseDto> {
    const query: FindSchedulePaginatedQuery = new FindSchedulePaginatedQuery({
      ...queryParams,
    })

    const result: Paginated<ScheduleResponseDto> = await this.queryBus.execute(query)

    return new SchedulePaginatedResponseDto({
      ...queryParams,
      ...result,
      items: result.items,
    })
  }
}
