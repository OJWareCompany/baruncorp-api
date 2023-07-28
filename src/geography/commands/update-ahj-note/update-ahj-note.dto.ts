export class UpdateAhjNoteDto {
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
  readonly snowLoadSlopedRoof: string | null
  readonly ofWetStamps: string | null
  readonly electricalNotes: string | null

  /**
   * 클래스에 정의되지 않은 필드를 수정하는 것을 방지
   */
  constructor(create: UpdateAhjNoteDto) {
    this.website = create.website
    this.specificFormRequired = create.specificFormRequired
    this.generalNotes = create.generalNotes
    this.buildingCodes = create.buildingCodes
    this.fireSetBack = create.fireSetBack
    this.utilityNotes = create.utilityNotes
    this.designNotes = create.designNotes
    this.pvMeterRequired = create.pvMeterRequired
    this.acDisconnectRequired = create.acDisconnectRequired
    this.centerFed120Percent = create.centerFed120Percent
    this.deratedAmpacity = create.deratedAmpacity
    this.engineeringNotes = create.engineeringNotes
    this.iebcAccepted = create.iebcAccepted
    this.structuralObservationRequired = create.structuralObservationRequired
    this.windUpliftCalculationRequired = create.windUpliftCalculationRequired
    this.wetStampsRequired = create.wetStampsRequired
    this.digitalSignatureType = create.digitalSignatureType
    this.windExposure = create.windExposure
    this.wetStampSize = create.wetStampSize
    this.windSpeed = create.windSpeed
    this.snowLoadGround = create.snowLoadGround
    this.snowLoadFlatRoof = create.snowLoadFlatRoof
    this.snowLoadSlopedRoof = create.snowLoadSlopedRoof
    this.ofWetStamps = create.ofWetStamps
    this.electricalNotes = create.electricalNotes
  }
}
