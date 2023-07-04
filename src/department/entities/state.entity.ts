import { StateProps } from '../interfaces/state.interface'

export class StateEntity implements StateProps {
  readonly name: string
  readonly abbreviation: string

  constructor(props: StateProps) {
    this.name = props.name
    this.abbreviation = props.abbreviation
  }
}
