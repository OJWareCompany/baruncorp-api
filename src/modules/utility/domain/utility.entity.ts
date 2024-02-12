import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { UtilitySnapshotProps, CreateUtilitySnapshotProps } from './utility-snapshot.type'
import { CreateUtilityProps, UtilityProps } from '@modules/utility/domain/utility.type'

export class UtilityEntity extends AggregateRoot<UtilityProps> {
  protected _id: string

  static create(create: CreateUtilityProps) {
    const id = v4()
    const props: UtilityProps = {
      ...create,
    }

    return new UtilityEntity({ id, props })
  }

  get name(): string {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
  }

  get stateAbbreviations(): string[] {
    return this.props.stateAbbreviations
  }

  set stateAbbreviations(stateAbbreviations: string[]) {
    this.props.stateAbbreviations = stateAbbreviations
  }

  get notes(): string {
    return this.props.notes
  }

  set notes(notes: string) {
    this.props.notes = notes
  }

  public validate(): void {
    return
  }
}
