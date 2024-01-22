import { ClientNoteSnapshot } from './value-objects/client-not-snapshot.vo'

export interface CreateClientNoteProps {
  organizationId: string
}

export interface ClientNoteProps extends CreateClientNoteProps {
  snapshots: ClientNoteSnapshot[]
}
