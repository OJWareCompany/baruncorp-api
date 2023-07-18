import { AHJNotesModel } from './geography.repository'
import { Page } from 'src/common/helpers/pagination/page'

export interface GeographyRepositoryPort {
  findNotes(pageNo: number, pageSize: number, fullAhjName?: string): Promise<Page<Partial<AHJNotesModel>>>
  findNoteByGeoId(geoId: string): Promise<AHJNotesModel>
  updateNote(model: AHJNotesModel): Promise<void>
  // findNoteHistory(): Promise<AHJNotesModel>
  // findNoteHistoryByNoteId(): Promise<AHJNotesModel>
}
