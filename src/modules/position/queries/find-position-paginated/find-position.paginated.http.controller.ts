import { Controller, Get, Query } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { Positions } from '@prisma/client'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PositionPaginatedResponseDto } from '../../dtos/position.paginated.response.dto'
import { FindPositionPaginatedRequestDto } from './find-position.paginated.request.dto'
import { FindPositionPaginatedQuery } from './find-position.paginated.query-handler'

@Controller('positions')
export class FindPositionPaginatedHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('')
  async get(
    @Query() request: FindPositionPaginatedRequestDto,
    @Query() queryParams: PaginatedQueryRequestDto,
  ): Promise<PositionPaginatedResponseDto> {
    const command = new FindPositionPaginatedQuery({
      // ...request,
      ...queryParams,
    })

    const result: Paginated<Positions> = await this.queryBus.execute(command)

    return new PositionPaginatedResponseDto({
      ...queryParams,
      ...result,
      items: result.items.map((item) => ({
        id: 'sa22-4a33-11ra-3rdw-403a',
        name: 'Sr. Designer',
        maxAssignedTasksLimit: 0,
        description: null,
        tasks: [{ taskId: 'asd', taskName: 'PV Design', order: 1, autoAssignmentType: 'Commercial' }],
      })),
    })
  }
}
