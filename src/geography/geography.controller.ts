import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common'
import { GeographyService } from './geography.service'
import { AHJNoteHistoryModel, AHJNotesModel } from './database/geography.repository'
import { UpdateNoteRequestDto } from './dto/update-notes.request.dto'
import { Paginated, PaginatedResponseDto } from '../common/helpers/pagination/page.res.dto'
import { AhjNoteMapper } from './ahj-note.mapper'
import { PaginatedQueryRequestDto } from '../common/helpers/pagination/paginated-query.req.dto'
import { AhjNoteResponseDto } from './dto/find-ahj-notes.response.dto'
import { ApiResponse } from '@nestjs/swagger'
import { UpdateNoteDto } from './dto/update-notes.dto'
import { AhjNoteHistoryResponseDto } from './dto/find-ahj-notes-history.response.dto'
import { FindAhjNotesSearchQueryRequestDto } from './queries/find-ahj-notes/find-ahj-notes-search-query.request.dto'
import { AhjNotePaginatedResponseDto } from './dto/ahj-note.paginated.response.dto'
import { AhjNoteHistoryPaginatedResponseDto } from './dto/ahj-note-history.paginated.response.dto'
import { FindAhjNotesHistorySearchQueryRequestDto } from './queries/find-ahj-history/find-ahj-notes-history-search-query.request.dto'

@Controller('geography')
export class GeographyController {
  constructor(private readonly geographyService: GeographyService, private readonly ahjNoteMapper: AhjNoteMapper) {}

  @Get('notes')
  async findNotes(
    @Query() paginatedQueryRequestDto: PaginatedQueryRequestDto,
    @Query() searchQuery: FindAhjNotesSearchQueryRequestDto,
  ): Promise<AhjNotePaginatedResponseDto> {
    const result: Paginated<Partial<AHJNotesModel>> = await this.geographyService.findNotes(
      paginatedQueryRequestDto.page,
      paginatedQueryRequestDto.limit,
      searchQuery,
    )
    const items = result.items.map(this.ahjNoteMapper.toListResponse)
    return new AhjNotePaginatedResponseDto({ ...result, items })
  }

  @Get(':geoId/notes')
  async findNoteByGeoId(@Param('geoId') geoId: string): Promise<AhjNoteResponseDto> {
    return this.ahjNoteMapper.toResponse(await this.geographyService.findNoteByGeoId(geoId))
  }

  @Put(':geoId/notes')
  async updateNote(@Param('geoId') geoId: string, @Body() dto: UpdateNoteRequestDto): Promise<void> {
    const { general, design, engineering, electricalEngineering } = dto
    const update = new UpdateNoteDto({ ...general, ...design, ...engineering, ...electricalEngineering })
    await this.geographyService.updateNote(geoId, update)
  }

  @Get('notes/history/:historyId')
  async findNoteUpdateHistoryDetail(@Param('historyId') historyId: number): Promise<AhjNoteHistoryResponseDto> {
    return this.ahjNoteMapper.toResponse(
      await this.geographyService.findNoteUpdateHistoryDetail(historyId),
    ) as AhjNoteHistoryResponseDto
  }

  @Get('notes/history')
  async findNoteUpdateHistory(
    @Query() paginatedQueryRequestDto: PaginatedQueryRequestDto,
    @Query() query: FindAhjNotesHistorySearchQueryRequestDto,
  ): Promise<AhjNoteHistoryPaginatedResponseDto> {
    const result = await this.geographyService.findNoteUpdateHistory(
      paginatedQueryRequestDto.page,
      paginatedQueryRequestDto.limit,
      query.geoId,
    )
    const items = result.items.map(this.ahjNoteMapper.toHistoryListResponse)
    return new AhjNoteHistoryPaginatedResponseDto({ ...result, items })
  }
}
