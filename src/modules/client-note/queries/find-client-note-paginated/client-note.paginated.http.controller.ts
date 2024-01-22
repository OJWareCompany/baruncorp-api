import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { ClientNotePaginatedResponseDto } from '../../dtos/client-note.paginated.response.dto'
import {
  FindClientNotePaginatedQuery,
  FindClientNotePaginatedQueryHandler,
} from './client-note.paginated.query-handler'
import { ClientNoteResponseDto } from '../../dtos/client-note.response.dto'
import { FindClientNotePaginatedRequestDto } from './client-note.paginated.request.dto'

@Controller('client-note')
export class FindClientNotePaginatedHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('')
  @UseGuards(AuthGuard)
  async get(
    @Query() request: FindClientNotePaginatedRequestDto,
    @Query() queryParams: PaginatedQueryRequestDto,
  ): Promise<ClientNotePaginatedResponseDto> {
    const query = new FindClientNotePaginatedQuery({
      ...request,
      ...queryParams,
    })

    const result: Paginated<ClientNoteResponseDto> = await this.queryBus.execute(query)

    return new ClientNotePaginatedResponseDto({
      ...queryParams,
      ...result,
      items: result.items,
    })
  }
}
