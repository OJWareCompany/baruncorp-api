import { initialize } from '../../../../libs/utils/constructor-initializer'

export class UpdateAhjNoteCommand {
  readonly website: string | null
  readonly specificFormRequired: string | null
  readonly generalNotes: string | null
  readonly buildingCodes: string | null
  readonly fireSetBack: string | null
  readonly utilityNotes: string | null
  readonly designNotes: string | null
  readonly pvMeterRequired: string | null
  readonly acDisconnectRequired: string | null
  readonly centerFed120Percent: string | null
  readonly deratedAmpacity: string | null
  readonly engineeringNotes: string | null
  readonly iebcAccepted: string | null
  readonly structuralObservationRequired: string | null
  readonly windUpliftCalculationRequired: string | null
  readonly wetStampsRequired: string | null
  readonly digitalSignatureType: string | null
  readonly windExposure: string | null
  readonly wetStampSize: string | null
  readonly windSpeed: string | null
  readonly snowLoadGround: string | null
  readonly snowLoadFlatRoof: string | null
  readonly snowLoadSlopedRoof?: string | null
  readonly ofWetStamps: string | null
  readonly electricalNotes: string | null
  readonly editorUserId: string
  readonly geoId: string
  /**
   * 클래스에 정의되지 않은 필드를 수정하는 것을 방지
   */
  constructor(props: UpdateAhjNoteCommand) {
    initialize(this, props)
  }
}
