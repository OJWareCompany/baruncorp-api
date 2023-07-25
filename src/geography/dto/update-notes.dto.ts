export class UpdateNoteDto {
  readonly website: string
  readonly specificFormRequired: string
  readonly generalNotes: string
  readonly buildingCodes: string
  readonly fireSetBack: string
  readonly utilityNotes: string
  readonly designNotes: string
  readonly pvMeterRequired: string
  readonly acDisconnectRequired: string
  readonly centerFed120Percent: string
  readonly deratedAmpacity: string
  readonly engineeringNotes: string
  readonly iebcAccepted: string
  readonly structuralObservationRequired: string
  readonly windUpliftCalculationRequired: string
  readonly wetStampsRequired: string
  readonly digitalSignatureType: string
  readonly windExposure: string
  readonly wetStampSize: string
  readonly windSpeed: string
  readonly snowLoadGround: string
  readonly snowLoadFlatRoof: string
  readonly snowLoadSlopedRoof: string
  readonly ofWetStamps: string
  readonly electricalNotes: string

  /**
   * 클래스에 정의되지 않은 필드를 수정하는 것을 방지
   */
  constructor(create: UpdateNoteDto) {
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
