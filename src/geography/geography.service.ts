import { Inject, Injectable } from '@nestjs/common'
import { GeographyRepositoryPort } from './database/geography.repository.port'
import { AHJNotesModel } from './database/geography.repository'
import { GEOGRAPHY_REPOSITORY } from './geography.di-token'
import { UpdateNoteType } from './types/update-notes.type'
import { Page } from 'src/common/helpers/pagination/page'

@Injectable()
export class GeographyService {
  constructor(@Inject(GEOGRAPHY_REPOSITORY) private readonly geographyRepository: GeographyRepositoryPort) {}

  async findNotes(pageNo: number, pageSize: number, fullAhjName?: string): Promise<Page<Partial<AHJNotesModel>>> {
    return await this.geographyRepository.findNotes(pageNo, pageSize, fullAhjName)
  }

  async findNoteUpdateHistory(pageNo: number, pageSize: number, geoId?: string): Promise<Page<Partial<AHJNotesModel>>> {
    return await this.geographyRepository.findNoteHistory(pageNo, pageSize, geoId)
  }

  async findNoteByGeoId(geoId: string): Promise<AHJNotesModel> {
    return await this.geographyRepository.findNoteByGeoId(geoId)
  }

  async findNoteUpdateHistoryDetail(historyId: number): Promise<AHJNotesModel> {
    return await this.geographyRepository.findNoteUpdateHistoryDetail(historyId)
  }

  async updateNote(geoId: string, dto: UpdateNoteType): Promise<void> {
    const model = await this.findNoteByGeoId(geoId)
    Object.entries(dto).forEach(([key, value]) => {
      model[key] = value
    })
    await this.geographyRepository.updateNote(model)
  }
}
