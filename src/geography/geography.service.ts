import { Inject, Injectable } from '@nestjs/common'
import { GeographyRepositoryPort } from './database/geography.repository.port'
import { AHJNoteHistoryModel, AHJNotesModel } from './database/geography.repository'
import { GEOGRAPHY_REPOSITORY } from './geography.di-token'
import { Paginated } from '../common/helpers/pagination/page.response.dto'
import { FindAhjNotesSearchQueryRequestDto } from './queries/find-ahj-notes/find-ahj-notes-search-query.request.dto'
import { AhjNoteListResponseDto } from './dto/ahj-note.paginated.response.dto'
import { AhjNoteHistoryListResponseDto } from './dto/ahj-note-history.paginated.response.dto'
import { UserEntity } from '../users/domain/user.entity'
import { UpdateAhjNoteDto } from './commands/update-ahj-note/update-ahj-note.dto'

@Injectable()
export class GeographyService {
  constructor(@Inject(GEOGRAPHY_REPOSITORY) private readonly geographyRepository: GeographyRepositoryPort) {}

  async findNotes(
    pageNo: number,
    pageSize: number,
    searchQuery: FindAhjNotesSearchQueryRequestDto,
  ): Promise<Paginated<Pick<AHJNotesModel, keyof AhjNoteListResponseDto>>> {
    return await this.geographyRepository.findNotes(pageNo, pageSize, searchQuery)
  }

  async findNoteUpdateHistory(
    pageNo: number,
    pageSize: number,
    geoId?: string,
  ): Promise<Paginated<Pick<AHJNoteHistoryModel, keyof AhjNoteHistoryListResponseDto>>> {
    return await this.geographyRepository.findNoteHistory(pageNo, pageSize, geoId)
  }

  async findNoteByGeoId(geoId: string): Promise<AHJNotesModel> {
    return await this.geographyRepository.findNoteByGeoId(geoId)
  }

  async deleteNoteByGeoId(geoId: string): Promise<void> {
    return await this.geographyRepository.deleteNoteByGeoId(geoId)
  }

  async findNoteUpdateHistoryDetail(historyId: number): Promise<AHJNotesModel> {
    return await this.geographyRepository.findNoteUpdateHistoryDetail(historyId)
  }

  async updateNote(user: UserEntity, geoId: string, dto: UpdateAhjNoteDto): Promise<void> {
    await this.geographyRepository.updateNote(user.getProps().userName.getFullName(), geoId, dto)
  }
}
