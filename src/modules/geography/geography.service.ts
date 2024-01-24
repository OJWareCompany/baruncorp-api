/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, Injectable } from '@nestjs/common'
import { GeographyRepositoryPort } from './database/geography.repository.port'
import { AHJNoteHistoryModel, AHJNotesModel } from './database/geography.repository'
import { GEOGRAPHY_REPOSITORY } from './geography.di-token'
import { Paginated } from '../../libs/ddd/repository.port'
import { FindAhjNotesSearchQueryRequestDto } from './queries/find-ahj-notes/find-ahj-notes-search-query.request.dto'
import { AhjNoteListResponseDto } from './dto/ahj-note.paginated.response.dto'
import { UserEntity } from '../users/domain/user.entity'
import { UpdateAhjNoteCommand } from './commands/update-ahj-note/update-ahj-note.command'
import { AhjNoteHistoryNotFoundException, AhjNoteNotFoundException } from './domain/ahj-job-note.error'

@Injectable()
export class GeographyService {
  constructor(
    // @ts-ignore
    @Inject(GEOGRAPHY_REPOSITORY) private readonly geographyRepository: GeographyRepositoryPort,
  ) {}

  async findNotes(
    searchQuery: FindAhjNotesSearchQueryRequestDto,
    pageNo: number,
    pageSize: number,
  ): Promise<Paginated<Pick<AHJNotesModel, keyof AhjNoteListResponseDto>>> {
    return await this.geographyRepository.findNotes(searchQuery, pageNo, pageSize)
  }

  async findNoteUpdateHistory(
    pageNo: number,
    pageSize: number,
    geoId: string | null,
  ): Promise<Paginated<AHJNoteHistoryModel>> {
    return await this.geographyRepository.findNoteHistory(pageNo, pageSize, geoId)
  }

  async findNoteByGeoId(geoId: string): Promise<AHJNotesModel> {
    const note = await this.geographyRepository.findNoteByGeoIdOrThrow(geoId)
    if (!note) throw new AhjNoteNotFoundException()
    return note
  }

  async deleteNoteByGeoId(geoId: string): Promise<void> {
    const note = await this.geographyRepository.findNoteByGeoIdOrThrow(geoId)
    if (!note) throw new AhjNoteNotFoundException()
    return await this.geographyRepository.deleteNoteByGeoId(geoId)
  }

  async findNoteUpdateHistoryDetail(geoId: string, updatedAt: Date): Promise<AHJNoteHistoryModel> {
    const note = await this.geographyRepository.findAhjNoteHistoryDetail(geoId, updatedAt)
    if (!note) throw new AhjNoteHistoryNotFoundException()
    return note
  }

  async findNoteBeforeHistoryDetail(model: AHJNoteHistoryModel): Promise<AHJNoteHistoryModel | null> {
    const note = await this.geographyRepository.findAhjNoteBeforeHistoryDetail(model)
    return note
  }

  async updateNote(user: UserEntity, geoId: string, dto: UpdateAhjNoteCommand): Promise<void> {
    const note = await this.geographyRepository.findNoteByGeoIdOrThrow(geoId)
    if (!note) throw new AhjNoteNotFoundException()
    await this.geographyRepository.updateNoteAndCreateHistory(user.userName.fullName, geoId, dto)
  }
}
