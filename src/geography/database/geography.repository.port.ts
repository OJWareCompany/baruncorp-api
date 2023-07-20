import { Counties, CountySubdivisions, Places, States } from '@prisma/client'
import { AHJNoteHistoryModel, AHJNotesModel } from './geography.repository'
import { Page } from 'src/common/helpers/pagination/page'

export interface GeographyRepositoryPort {
  findNotes(pageNo: number, pageSize: number, fullAhjName?: string): Promise<Page<Partial<AHJNotesModel>>>
  findNoteByGeoId(geoId: string): Promise<AHJNotesModel>
  updateNote(model: AHJNotesModel): Promise<void>
  findNoteHistory(pageNo: number, pageSize: number, geoId?: string): Promise<Page<Partial<AHJNoteHistoryModel>>>
  // findNoteHistoryByNoteId(): Promise<AHJNotesModel>
  findNoteUpdateHistoryDetail(historyId: number): Promise<AHJNoteHistoryModel>
  findStateByGeoId(geoId: string): Promise<States>
  findCountiesByGeoId(geoId: string): Promise<Counties>
  findCountySubdivisionByGeoId(geoId: string): Promise<CountySubdivisions>
  findPlaceByGeoId(geoId: string): Promise<Places>
}
