import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common'
import { GeographyService } from './geography.service'
import { AHJNotesModel } from './database/geography.repository'
import { UpdateNoteRequestDto } from './dto/update-notes.request.dto'
import { Page } from '../common/helpers/pagination/page'
import { AhjNoteMapper, AhjNoteResponseDto } from './ahj-note.mapper'

@Controller('geography')
export class GeographyController {
  constructor(private readonly geographyService: GeographyService, private readonly ahjNoteMapper: AhjNoteMapper) {}

  @Get('notes')
  async findNotes(
    @Query('pageNo') pageNo = 1,
    pageSize = 20,
    @Query('fullAhjName') fullAhjName?: string,
  ): Promise<Page<Partial<AHJNotesModel>>> {
    return await this.geographyService.findNotes(pageNo, pageSize, fullAhjName)
  }

  @Get(':geoId/notes')
  async findNoteByGeoId(@Param('geoId') geoId: string): Promise<AhjNoteResponseDto> {
    return this.ahjNoteMapper.toResponse(await this.geographyService.findNoteByGeoId(geoId))
  }

  @Put(':geoId/notes')
  async updateNote(@Param('geoId') geoId: string, @Body() dto: UpdateNoteRequestDto): Promise<void> {
    const { general, design, engineering, electricalEngineering } = dto
    await this.geographyService.updateNote(geoId, { ...general, ...design, ...engineering, ...electricalEngineering })
  }

  @Get('notes/history/:historyId')
  async findNoteUpdateHistoryDetail(@Param('historyId') historyId: number): Promise<AhjNoteResponseDto> {
    return this.ahjNoteMapper.toResponse(await this.geographyService.findNoteUpdateHistoryDetail(historyId))
  }

  @Get('notes/history')
  async findNoteUpdateHistory(
    @Query('pageNo') pageNo = 1,
    pageSize = 20,
    @Query('geoId') geoId?: string,
  ): Promise<Page<Partial<AHJNotesModel>>> {
    return await this.geographyService.findNoteUpdateHistory(pageNo, pageSize, geoId)
  }
}
