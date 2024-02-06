import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { CouriersResponseDto } from '@modules/couriers/dtos/couriers.response.dto'
import { CouriersPaginatedResponseDto } from '@modules/couriers/dtos/couriers.paginated.response.dto'
import { FindCouriersPaginatedQuery } from '@modules/couriers/queries/find-couriers-paginated/find-couriers.paginated.query-handler'

@Controller('couriers')
export class FindCouriersPaginatedHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('')
  @UseGuards(AuthGuard)
  async get(@Query() queryParams: PaginatedQueryRequestDto): Promise<CouriersPaginatedResponseDto> {
    const query: FindCouriersPaginatedQuery = new FindCouriersPaginatedQuery({
      ...queryParams,
    })

    const result: Paginated<CouriersResponseDto> = await this.queryBus.execute(query)

    return new CouriersPaginatedResponseDto({
      ...queryParams,
      ...result,
      items: result.items,
    })
  }
}
