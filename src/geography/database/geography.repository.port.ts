import { AHJNoteHistoryModel, AHJNotesModel } from './geography.repository'
import { Page } from '../../common/helpers/pagination/page.res.dto'
import {
  CensusCounties,
  CensusCountySubdivisions,
  CensusPlace,
  CensusState,
} from '../../project/infra/census/census.type.dto'
import { UpdateNoteType } from '../types/update-notes.type'

export interface GeographyRepositoryPort {
  findNotes(pageNo: number, pageSize: number, fullAhjName?: string): Promise<Page<Partial<AHJNotesModel>>>
  findNoteByGeoId(geoId: string): Promise<AHJNotesModel>
  updateNote(geoId: string, update: UpdateNoteType): Promise<void>
  findNoteHistory(pageNo: number, pageSize: number, geoId?: string): Promise<Page<Partial<AHJNoteHistoryModel>>>

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
