import { Body, Controller, Delete, Get, Param, Put, Query, UseGuards } from '@nestjs/common'
import { GeographyService } from './geography.service'
import { AHJNotesModel } from './database/geography.repository'
import { Paginated } from '../common/helpers/pagination/page.response.dto'
import { AhjNoteMapper } from './ahj-note.mapper'
import { PaginatedQueryRequestDto } from '../common/helpers/pagination/paginated-query.request.dto'
import { AhjNoteResponseDto } from './dto/ahj-note.response.dto'
import { AhjNoteHistoryResponseDto } from './dto/ahj-note-history.response.dto'
import { FindAhjNotesSearchQueryRequestDto } from './queries/find-ahj-notes/find-ahj-notes-search-query.request.dto'
import { AhjNotePaginatedResponseDto } from './dto/ahj-note.paginated.response.dto'
import { AhjNoteHistoryPaginatedResponseDto } from './dto/ahj-note-history.paginated.response.dto'
import { FindAhjNotesHistorySearchQueryRequestDto } from './queries/find-ahj-history/find-ahj-notes-history-search-query.request.dto'
import { AuthGuard } from '../auth/authentication.guard'
import { UserEntity } from '../users/domain/user.entity'
import { User } from '../common/decorators/requests/logged-in-user.decorator'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { UpdateAhjNoteRequestDto } from './commands/update-ahj-note/update-ahj-note.request.dto'
import { UpdateAhjNoteDto } from './commands/update-ahj-note/update-ahj-note.dto'
import { AhjNoteHistoryParamRequestDto, GeoGraphyParamRequestDto } from './geography.param.request.dto'

@ApiBearerAuth()
@ApiTags('geography')
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
  async findNoteByGeoId(@Param() param: GeoGraphyParamRequestDto): Promise<AhjNoteResponseDto> {
    return this.ahjNoteMapper.toResponse(await this.geographyService.findNoteByGeoId(param.geoId))
  }

  @Delete(':geoId/notes')
  async deleteNoteByGeoId(@Param() param: GeoGraphyParamRequestDto): Promise<void> {
    await this.geographyService.deleteNoteByGeoId(param.geoId)
  }

  @Put(':geoId/notes')
  @UseGuards(AuthGuard)
  async updateNote(
    @User() user: UserEntity,
    @Param() param: GeoGraphyParamRequestDto,
    @Body() dto: UpdateAhjNoteRequestDto,
  ): Promise<void> {
    const { general, design, engineering, electricalEngineering } = dto
    const update = new UpdateAhjNoteDto({ ...general, ...design, ...engineering, ...electricalEngineering })
    await this.geographyService.updateNote(user, param.geoId, update)
  }

  @Get('notes/history/:historyId')
  async findNoteUpdateHistoryDetail(@Param() param: AhjNoteHistoryParamRequestDto): Promise<AhjNoteHistoryResponseDto> {
    return this.ahjNoteMapper.toResponse(
      await this.geographyService.findNoteUpdateHistoryDetail(param.historyId),
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
