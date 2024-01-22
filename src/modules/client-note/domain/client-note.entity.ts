import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { ClientNoteProps, CreateClientNoteProps } from './client-note.type'
import { ClientNoteSnapshot } from './value-objects/client-not-snapshot.vo'

export class ClientNoteEntity extends AggregateRoot<ClientNoteProps> {
  protected _id: string

  static create(create: CreateClientNoteProps) {
    const id = v4()
    const props: ClientNoteProps = {
      ...create,
      snapshots: [],
    }

    return new ClientNoteEntity({ id, props })
  }

  get snapshots(): ClientNoteSnapshot[] {
    return this.props.snapshots
  }

  set snapshots(snapshots: ClientNoteSnapshot[]) {
    this.props.snapshots = snapshots
  }

  public validate(): void {
    return
  }
}
