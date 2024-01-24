import { AHJNoteHistory } from '@prisma/client'
import { Paginated } from '../../../libs/ddd/repository.port'
import {
  CensusCounties,
  CensusCountySubdivisions,
  CensusPlace,
  CensusState,
} from '../../project/infra/census/census.type.dto'
import { FindAhjNotesSearchQueryRequestDto } from '../queries/find-ahj-notes/find-ahj-notes-search-query.request.dto'
import { UpdateAhjNoteCommand } from '../commands/update-ahj-note/update-ahj-note.command'
import { AHJNoteHistoryModel, AHJNotesModel } from './geography.repository'

export interface GeographyRepositoryPort {
  findNotes(
    searchQuery: FindAhjNotesSearchQueryRequestDto,
    pageNo: number,
    pageSize: number,
  ): Promise<Paginated<AHJNotesModel>>
  findNoteByGeoIdOrThrow(geoId: string): Promise<AHJNotesModel>
  deleteNoteByGeoId(geoId: string): Promise<void>
  updateNoteAndCreateHistory(username: string, geoId: string, update: UpdateAhjNoteCommand): Promise<void>
  findNoteHistory(pageNo: number, pageSize: number, geoId: string | null): Promise<Paginated<AHJNoteHistoryModel>>

  findAhjNoteHistoryDetail(geoId: string, updatedAt: Date): Promise<AHJNoteHistory>
  findAhjNoteBeforeHistoryDetail(model: AHJNoteHistory): Promise<AHJNoteHistory | null>

  createState(create: CensusState): Promise<void>
  createCounty(create: CensusCounties): Promise<void>
  createCountySubdivisions(create: CensusCountySubdivisions): Promise<void>
  createPlace(create: CensusPlace): Promise<void>

  updateStateNote(create: CensusState): Promise<void>
  updateCountyNote(create: CensusCounties, state: CensusState): Promise<void>
  updateCountySubdivisionsNote(
    create: CensusCountySubdivisions,
    state: CensusState,
    county: CensusCounties,
  ): Promise<void>
  updatePlaceNote(
    create: CensusPlace,
    state: CensusState,
    county: CensusCounties,
    subdivision: CensusCountySubdivisions | null,
  ): Promise<void>
}
