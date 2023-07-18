import { IsOptional } from 'class-validator'

type General = {
  website?: string
  specificFormRequired?: string
  generalNotes?: string
  buildingCodes?: string
}

type Design = {
  fireSetBack?: string
  utilityNotes?: string
  designNotes?: string
  PVMeterRequired?: string
  ACDisconnectRequired?: string
  centerFed120Percent?: string
  deratedAmpacity?: string
}

type Engineering = {
  engineeringNotes?: string
  iEBCAccepted?: string
  structuralObservationRequired?: string
  windUpliftCalculationRequired?: string
  wetStampsRequired?: string
  digitalSignature?: string
  windExposure?: string
  wetStampSize?: string
  windSpeed?: string
  snowLoadGround?: string
  snowLoadFlatRoof?: string
  snowLoadSlopedRoof?: string
  ofWetStamps?: string
}

type ElectricalEngineering = {
  electricalNotes?: string
}

export class UpdateNoteRequestDto {
  @IsOptional()
  general: General
  @IsOptional()
  design: Design
  @IsOptional()
  engineering: Engineering
  @IsOptional()
  electricalEngineering: ElectricalEngineering
}
