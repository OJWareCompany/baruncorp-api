import { AHJNotes } from '@prisma/client'
import { AHJNotesModel } from './geography.repository'

export interface GeographyRepositoryPort {
  findNotes(): Promise<Partial<AHJNotes>[]>
  findNoteByGeoId(geoId: string): Promise<AHJNotesModel>
  updateNote(model: AHJNotesModel): Promise<void>
  // findNoteHistory(): Promise<AHJNotesModel>
  // findNoteHistoryByNoteId(): Promise<AHJNotesModel>
}
