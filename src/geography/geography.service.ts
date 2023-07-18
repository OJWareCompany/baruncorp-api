import { Inject, Injectable } from '@nestjs/common'
import { GeographyRepositoryPort } from './database/geography.repository.port'
import { AHJNotesModel } from './database/geography.repository'
import { GEOGRAPHY_REPOSITORY } from './geography.di-token'
import { UpdateNoteType } from './types/update-notes.type'

@Injectable()
export class GeographyService {
  constructor(@Inject(GEOGRAPHY_REPOSITORY) private readonly geographyRepository: GeographyRepositoryPort) {}

  async findNotes(): Promise<Partial<AHJNotesModel>[]> {
    return await this.geographyRepository.findNotes()
  }

  async findNoteByGeoId(geoId: string): Promise<AHJNotesModel> {
    return await this.geographyRepository.findNoteByGeoId(geoId)
  }

  async updateNote(geoId: string, dto: UpdateNoteType): Promise<void> {
    const model = await this.findNoteByGeoId(geoId)
    Object.entries(dto).forEach(([key, value]) => {
      model[key] = value
    })
    await this.geographyRepository.updateNote(model)
  }
}
