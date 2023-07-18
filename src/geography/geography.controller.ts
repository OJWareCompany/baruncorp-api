import { Body, Controller, Get, Param, Put } from '@nestjs/common'
import { GeographyService } from './geography.service'
import { AHJNotesModel } from './database/geography.repository'
import { UpdateNoteRequestDto } from './dto/update-notes.request.dto'

@Controller('geography')
export class GeographyController {
  constructor(private readonly geographyService: GeographyService) {}

  @Get('notes')
  async findNotes(): Promise<Partial<AHJNotesModel>[]> {
    return await this.geographyService.findNotes()
  }

  @Get(':geoId/notes/')
  async findNoteByGeoId(@Param('geoId') geoId: string): Promise<AHJNotesModel> {
    return await this.geographyService.findNoteByGeoId(geoId)
  }

  @Put(':geoId/notes/')
  async updateNote(@Param('geoId') geoId: string, @Body() dto: UpdateNoteRequestDto): Promise<void> {
    const { general, design, engineering, electricalEngineering } = dto
    await this.geographyService.updateNote(geoId, { ...general, ...design, ...engineering, ...electricalEngineering })
  }
}
