import { StateProps } from '../interfaces/state.interface'

export class StateEntity implements StateProps {
  readonly stateName: string
  readonly abbreviation?: string
  readonly geoId?: string
  readonly stateCode?: string
  readonly ansiCode?: string
  readonly stateLongName?: string

  constructor(props: StateProps) {
    this.stateName = props.stateName
    this.abbreviation = props.abbreviation
    this.geoId = props.geoId
    this.stateCode = props.stateCode
    this.ansiCode = props.ansiCode
    this.stateLongName = props.stateLongName
  }
}
