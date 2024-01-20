import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { InformationResponseDto } from '../../dtos/information.response.dto'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { InformationPaginatedResponseDto } from '../../dtos/information.paginated.response.dto'
import { FindInformationPaginatedQuery } from './information.paginated.query-handler'

@Controller('informations')
export class FindInformationPaginatedHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('')
  @UseGuards(AuthGuard)
  async get(@Query() queryParams: PaginatedQueryRequestDto): Promise<InformationPaginatedResponseDto> {
    const query = new FindInformationPaginatedQuery({
      ...queryParams,
    })

    const result: Paginated<InformationResponseDto> = await this.queryBus.execute(query)

    return new InformationPaginatedResponseDto({
      ...queryParams,
      ...result,
      items: result.items,
    })
  }
}
