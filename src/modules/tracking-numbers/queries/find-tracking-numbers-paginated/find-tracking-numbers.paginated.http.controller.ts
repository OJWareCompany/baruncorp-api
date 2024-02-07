import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { CouriersResponseDto } from '@modules/couriers/dtos/couriers.response.dto'
import { CouriersPaginatedResponseDto } from '@modules/couriers/dtos/couriers.paginated.response.dto'
import { FindCouriersPaginatedQuery } from '@modules/couriers/queries/find-couriers-paginated/find-couriers.paginated.query-handler'
import { FindPtoDetailPaginatedRequestDto } from '@modules/pto/queries/find-pto-detail-paginated/find-pto-detail.paginated.request.dto'
import { TrackingNumbersPaginatedResponseDto } from '@modules/tracking-numbers/dtos/tracking-numbers.paginated.response.dto'
import { TrackingNumbersResponseDto } from '@modules/tracking-numbers/dtos/tracking-numbers.response.dto'
import { FindTrackingNumbersPaginatedQuery } from '@modules/tracking-numbers/queries/find-tracking-numbers-paginated/find-tracking-numbers.paginated.query-handler'
import { FindTrackingNumbersPaginatedRequestDto } from '@modules/tracking-numbers/queries/find-tracking-numbers-paginated/find-tracking-numbers.paginated.request.dto'

@Controller('tracking-numbers')
export class FindTrackingNumbersPaginatedHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('')
  @UseGuards(AuthGuard)
  async get(
    @Query() request: FindTrackingNumbersPaginatedRequestDto,
    @Query() queryParams: PaginatedQueryRequestDto,
  ): Promise<TrackingNumbersPaginatedResponseDto> {
    const query: FindTrackingNumbersPaginatedQuery = new FindTrackingNumbersPaginatedQuery({
      ...request,
      ...queryParams,
    })

    const result: Paginated<TrackingNumbersResponseDto> = await this.queryBus.execute(query)

    return new TrackingNumbersPaginatedResponseDto({
      ...queryParams,
      ...result,
      items: result.items,
    })
  }
}
