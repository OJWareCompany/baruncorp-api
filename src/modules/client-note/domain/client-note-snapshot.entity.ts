import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { CreateClientNoteSnapshotProps, ClientNoteSnapshotProps } from './client-note-snapshot.type'

export class ClientNoteSnapshotEntity extends AggregateRoot<ClientNoteSnapshotProps> {
  protected _id: string

  static create(create: CreateClientNoteSnapshotProps) {
    const id = v4()
    const props: ClientNoteSnapshotProps = {
      ...create,
    }

    return new ClientNoteSnapshotEntity({ id, props })
  }

  public validate(): void {
    return
  }
}
