import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { UtilitySnapshotProps, CreateUtilitySnapshotProps } from './utility-snapshot.type'

export class UtilitySnapshotEntity extends AggregateRoot<UtilitySnapshotProps> {
  protected _id: string

  static create(create: CreateUtilitySnapshotProps) {
    const id = v4()
    const props: UtilitySnapshotProps = {
      ...create,
    }

    return new UtilitySnapshotEntity({ id, props })
  }

  public validate(): void {
    return
  }
}
