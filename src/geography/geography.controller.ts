import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common'
import { GeographyService } from './geography.service'
import { AHJNotesModel } from './database/geography.repository'
import { UpdateNoteRequestDto } from './dto/update-notes.request.dto'
import { Page } from '../common/helpers/pagination/page.res.dto'
import { AhjNoteMapper } from './ahj-note.mapper'
import { PaginatedQueryRequestDto } from '../common/helpers/pagination/paginated-query.req.dto'
import { AhjNoteResponseDto } from './dto/find-ahj-notes.response.dto'
import { ApiResponse } from '@nestjs/swagger'
import { UpdateNoteDto } from './dto/update-notes.dto'

@Controller('geography')
export class GeographyController {
  constructor(private readonly geographyService: GeographyService, private readonly ahjNoteMapper: AhjNoteMapper) {}

  @Get('notes')
  @ApiResponse({ type: Page })
  async findNotes(
    @Query() paginatedQueryRequestDto: PaginatedQueryRequestDto,
    @Query('fullAhjName') fullAhjName?: string,
  ): Promise<Page<Partial<AHJNotesModel>>> {
    return await this.geographyService.findNotes(
      paginatedQueryRequestDto.page,
      paginatedQueryRequestDto.limit,
      fullAhjName,
    )
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
  async findNoteUpdateHistoryDetail(@Param('historyId') historyId: number): Promise<AhjNoteResponseDto> {
    return this.ahjNoteMapper.toResponse(await this.geographyService.findNoteUpdateHistoryDetail(historyId))
  }

  @Get('notes/history')
  async findNoteUpdateHistory(
    @Query() paginatedQueryRequestDto: PaginatedQueryRequestDto,
    @Query('geoId') geoId?: string,
  ): Promise<Page<Partial<AHJNotesModel>>> {
    return await this.geographyService.findNoteUpdateHistory(
      paginatedQueryRequestDto.page,
      paginatedQueryRequestDto.limit,
      geoId,
    )
  }
}
