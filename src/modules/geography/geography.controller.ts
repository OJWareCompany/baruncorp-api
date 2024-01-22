import { Body, Controller, Delete, Get, Param, Put, Query, UseGuards } from '@nestjs/common'
import { GeographyService } from './geography.service'
import { AHJNotesModel } from './database/geography.repository'
import { Paginated } from '../../libs/ddd/repository.port'
import { AhjNoteMapper } from './ahj-note.mapper'
import { AhjNoteResponseDto } from './dto/ahj-note.response.dto'
import { AhjNoteHistoryResponseDto } from './dto/ahj-note-history.response.dto'
import { FindAhjNotesSearchQueryRequestDto } from './queries/find-ahj-notes/find-ahj-notes-search-query.request.dto'
import { AhjNoteListResponseDto, AhjNotePaginatedResponseDto } from './dto/ahj-note.paginated.response.dto'
import { AhjNoteHistoryPaginatedResponseDto } from './dto/ahj-note-history.paginated.response.dto'
import { FindAhjNotesHistorySearchQueryRequestDto } from './queries/find-ahj-history/find-ahj-notes-history-search-query.request.dto'
import { AuthGuard } from '../auth/guards/authentication.guard'
import { UserEntity } from '../users/domain/user.entity'
import { User } from '../../libs/decorators/requests/logged-in-user.decorator'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { UpdateAhjNoteRequestDto } from './commands/update-ahj-note/update-ahj-note.request.dto'
import { UpdateAhjNoteCommand } from './commands/update-ahj-note/update-ahj-note.command'
import { FindAhjNoteHistoryDetailRequestDto, GeoGraphyParamRequestDto } from './geography.param.request.dto'
import { PaginatedQueryRequestDto } from '../../libs/api/paginated-query.request.dto'
import { AhjNoteHistoryMapper } from './ahj-note-history.mapper'

@ApiBearerAuth()
@ApiTags('geography')
@Controller('geography')
export class GeographyController {
  constructor(
    private readonly geographyService: GeographyService,
    private readonly ahjNoteMapper: AhjNoteMapper,
    private readonly ahjNoteHistoryMapper: AhjNoteHistoryMapper,
  ) {}

  @Get('notes')
  async getFindNotes(
    @Query() paginatedQueryRequestDto: PaginatedQueryRequestDto,
    @Query() searchQuery: FindAhjNotesSearchQueryRequestDto,
  ): Promise<AhjNotePaginatedResponseDto> {
    const result: Paginated<Pick<AHJNotesModel, keyof AhjNoteListResponseDto>> = await this.geographyService.findNotes(
      searchQuery,
      paginatedQueryRequestDto.page,
      paginatedQueryRequestDto.limit,
    )
    const items = result.items.map(this.ahjNoteMapper.toListResponse)
    return new AhjNotePaginatedResponseDto({ ...result, items })
  }

  @Get(':geoId/notes')
  async getFindNoteByGeoId(@Param() param: GeoGraphyParamRequestDto): Promise<AhjNoteResponseDto> {
    return this.ahjNoteMapper.toResponse(await this.geographyService.findNoteByGeoId(param.geoId))
  }

  @Put(':geoId/notes')
  @UseGuards(AuthGuard)
  async putUpdateNote(
    @User() user: UserEntity,
    @Param() param: GeoGraphyParamRequestDto,
    @Body() dto: UpdateAhjNoteRequestDto,
  ): Promise<void> {
    const { general, design, engineering, electricalEngineering } = dto
    const update = new UpdateAhjNoteCommand({
      ...general,
      ...design,
      ...engineering,
      ...electricalEngineering,
      editorUserId: user.id,
      geoId: param.geoId,
    })
    console.log(2222)
    await this.geographyService.updateNote(user, param.geoId, update)
  }

  @Delete(':geoId/notes')
  async deleteNoteByGeoId(@Param() param: GeoGraphyParamRequestDto): Promise<void> {
    await this.geographyService.deleteNoteByGeoId(param.geoId)
  }

  @Get(':geoId/notes/history')
  async getFinNoteUpdateHistoryDetail(
    @Param() param: GeoGraphyParamRequestDto,
    @Query() query: FindAhjNoteHistoryDetailRequestDto,
  ): Promise<AhjNoteHistoryResponseDto> {
    return this.ahjNoteHistoryMapper.toResponse(
      await this.geographyService.findNoteUpdateHistoryDetail(param.geoId, query.updatedAt),
    )
  }

  @Get('notes/history')
  async getFindNoteUpdateHistory(
    @Query() paginatedQueryRequestDto: PaginatedQueryRequestDto,
    @Query() query: FindAhjNotesHistorySearchQueryRequestDto,
  ): Promise<AhjNoteHistoryPaginatedResponseDto> {
    const result = await this.geographyService.findNoteUpdateHistory(
      paginatedQueryRequestDto.page,
      paginatedQueryRequestDto.limit,
      query.geoId,
    )
    const items = result.items.map(this.ahjNoteHistoryMapper.toListResponse)
    return new AhjNoteHistoryPaginatedResponseDto({ ...result, items })
  }
}
