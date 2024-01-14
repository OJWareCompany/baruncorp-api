import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PtoPaginatedResponseDto } from '../../dtos/pto.paginated.response.dto'
import { FindPtoPaginatedRequestDto } from './find-pto-detail.paginated.request.dto'
import { FindPtoDetailPaginatedQuery } from './find-pto-detail.paginated.query-handler'
import { PtoResponseDto } from '../../dtos/pto.response.dto'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { PtoDetailResponseDto } from '../../dtos/pto-detail.response.dto'

// @Controller('ptos/detail')
// export class FindPtoDetailPaginatedHttpController {
//   constructor(
//     private readonly queryBus: QueryBus) {}

//   @Get('')
//   // @UseGuards(AuthGuard)
//   async get(@Query() queryParams: PaginatedQueryRequestDto): Promise<PtoPaginatedResponseDto> {
//     const query = new FindPtoDetailPaginatedQuery({
//       ...queryParams,
//     })

//     const result: Paginated<PtoDetailResponseDto> = await this.queryBus.execute(query)

//     return new PtoPaginatedResponseDto({
//       ...queryParams,
//       ...result,
//       items: result.items,
//     })
//   }
// }