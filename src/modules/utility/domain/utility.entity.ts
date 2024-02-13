import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { CreateUtilityProps, UtilityProps } from '@modules/utility/domain/utility.type'
import { UtilityNameLengthException, UtilityNotFoundException } from '@modules/utility/domain/utilty.error'

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

  public checkValidation() {
    if (this.props.name.length < 2) {
      throw new UtilityNameLengthException()
    }
  }

  public validate(): void {
    return
  }
}
