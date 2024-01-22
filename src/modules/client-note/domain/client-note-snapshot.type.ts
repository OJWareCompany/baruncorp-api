import { ClientNoteSnapshot } from './value-objects/client-not-snapshot.vo'

export interface CreateClientNoteSnapshotProps {
  clientNoteId: string
  updatedBy: string
  designNotes: string
  electricalEngineeringNotes: string
  structuralEngineeringNotes: string
  type: ClientNoteTypeEnum
}

export type ClientNoteSnapshotProps = CreateClientNoteSnapshotProps

export const enum ClientNoteTypeEnum {
  Create = 'Create',
  Modify = 'Modify',
}
