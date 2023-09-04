export interface StateProps {
  stateName: string
  abbreviation: string
  geoId?: string
  stateCode?: string
  ansiCode?: string
  stateLongName?: string
}

export class State implements StateProps {
  readonly stateName: string
  readonly abbreviation: string
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
