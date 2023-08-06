import { AHJNoteHistoryModel, AHJNotesModel } from './geography.repository'
import { Paginated } from '../../../libs/ddd/page.response.dto'
import {
  CensusCounties,
  CensusCountySubdivisions,
  CensusPlace,
  CensusState,
} from '../../project/infra/census/census.type.dto'
import { FindAhjNotesSearchQueryRequestDto } from '../queries/find-ahj-notes/find-ahj-notes-search-query.request.dto'
import { AhjNoteListResponseDto } from '../dto/ahj-note.paginated.response.dto'
import { AhjNoteHistoryListResponseDto } from '../dto/ahj-note-history.paginated.response.dto'
import { UpdateAhjNoteDto } from '../commands/update-ahj-note/update-ahj-note.dto'

export interface GeographyRepositoryPort {
  findNotes(
    pageNo: number,
    pageSize: number,
    searchQuery: FindAhjNotesSearchQueryRequestDto,
  ): Promise<Paginated<Pick<AHJNotesModel, keyof AhjNoteListResponseDto>>>
  findNoteByGeoId(geoId: string): Promise<AHJNotesModel>
  deleteNoteByGeoId(geoId: string): Promise<void>
  updateNote(username: string, geoId: string, update: UpdateAhjNoteDto): Promise<void>
  findNoteHistory(
    pageNo: number,
    pageSize: number,
    geoId?: string,
  ): Promise<Paginated<Pick<AHJNoteHistoryModel, keyof AhjNoteHistoryListResponseDto>>>

  findNoteUpdateHistoryDetail(historyId: number): Promise<AHJNoteHistoryModel>
  // findStateByGeoId(geoId: string): Promise<States>
  // findCountiesByGeoId(geoId: string): Promise<Counties>
  // findCountySubdivisionByGeoId(geoId: string): Promise<CountySubdivisions>
  // findPlaceByGeoId(geoId: string): Promise<Places>

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
    subdivision: CensusCountySubdivisions,
  ): Promise<void>
}
