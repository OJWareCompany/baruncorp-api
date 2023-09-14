export interface StateProps {
  stateName: string
  abbreviation: string
  geoId: string | null
  stateCode: string | null
  ansiCode: string | null
  stateLongName: string | null
}

export class State implements StateProps {
  readonly stateName: string
  readonly abbreviation: string
  readonly geoId: string | null
  readonly stateCode: string | null
  readonly ansiCode: string | null
  readonly stateLongName: string | null

  constructor(props: StateProps) {
    this.stateName = props.stateName
    this.abbreviation = props.abbreviation
    this.geoId = props.geoId
    this.stateCode = props.stateCode
    this.ansiCode = props.ansiCode
    this.stateLongName = props.stateLongName
  }
}
