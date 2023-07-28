import { ApiProperty } from '@nestjs/swagger'

export enum AHJType {
  STATE = 'STATE',
  COUNTY = 'COUNTY',
  COUNTY_SUBDIVISIONS = 'COUNTY SUBDIVISIONS',
  PLACE = 'PLACE',
}

export enum SelectOption {
  No = 'No',
  Yes = 'Yes',
  SeeNotes = 'See Notes',
}

export enum ANSI {
  ANSI_A = 'ANSI A (8.5x11 INCH)',
  ANSI_B = 'ANSI B (11x17 INCH)',
  ANSI_D = 'ANSI D (22x34 INCH)',
  ARCH_D = 'ARCH D (24x36 INCH)',
  See_Notes = 'See Notes',
}

export enum WindExposure {
  B = 'B',
  C = 'C',
  D = 'D',
  SeeNotes = 'See Notes',
}

export enum DigitalSignatureType {
  Certified = 'Certified',
  Signed = 'Signed',
}

export class General {
  @ApiProperty({ default: 'https://google.com', nullable: true })
  website: string | null

  @ApiProperty({ enum: SelectOption, default: SelectOption.SeeNotes, nullable: true })
  specificFormRequired: string | null

  @ApiProperty({ default: 'generalNotes...', nullable: true })
  generalNotes: string | null

  @ApiProperty({ default: '2015 IBC2', nullable: true })
  buildingCodes: string | null

  @ApiProperty({ default: 'Arcata city' })
  name: string

  @ApiProperty({ default: 'Arroyo Grande city, California' })
  fullAhjName: string

  @ApiProperty({ default: new Date().toISOString(), nullable: true })
  createdAt: string | null

  @ApiProperty({ default: new Date().toISOString(), nullable: true })
  updatedAt: string | null

  @ApiProperty({ default: new Date().toISOString(), nullable: true })
  updatedBy: string | null

  @ApiProperty({ enum: AHJType, default: AHJType.COUNTY, nullable: true })
  type: string | null
}

export class Design {
  @ApiProperty({ default: 'fireSetBack...', nullable: true })
  fireSetBack: string | null

  @ApiProperty({ default: 'utilityNotes...', nullable: true })
  utilityNotes: string | null

  @ApiProperty({ default: 'designNotes...', nullable: true })
  designNotes: string | null

  @ApiProperty({ enum: SelectOption, default: SelectOption.SeeNotes, nullable: true })
  pvMeterRequired: string | null

  @ApiProperty({ enum: SelectOption, default: SelectOption.SeeNotes, nullable: true })
  acDisconnectRequired: string | null

  @ApiProperty({ enum: SelectOption, default: SelectOption.SeeNotes, nullable: true })
  centerFed120Percent: string | null

  @ApiProperty({ default: 'deratedAmpacity...', nullable: true })
  deratedAmpacity: string | null
}

export class Engineering {
  @ApiProperty({ enum: SelectOption, default: SelectOption.SeeNotes, nullable: true })
  iebcAccepted: string | null

  @ApiProperty({ enum: SelectOption, default: SelectOption.SeeNotes, nullable: true })
  structuralObservationRequired: string | null

  @ApiProperty({ enum: DigitalSignatureType, default: DigitalSignatureType.Certified, nullable: true })
  digitalSignatureType: string | null

  @ApiProperty({ enum: SelectOption, default: SelectOption.SeeNotes, nullable: true })
  windUpliftCalculationRequired: string | null

  @ApiProperty({ default: '115', nullable: true })
  windSpeed: string | null

  @ApiProperty({ enum: WindExposure, default: WindExposure.SeeNotes, nullable: true })
  windExposure: string | null

  @ApiProperty({ default: '30', nullable: true })
  snowLoadGround: string | null

  @ApiProperty({ default: '30', nullable: true })
  snowLoadFlatRoof: string | null

  @ApiProperty({ default: '30', nullable: true })
  snowLoadSlopedRoof: string | null

  @ApiProperty({ enum: SelectOption, default: SelectOption.SeeNotes, nullable: true })
  wetStampsRequired: string | null

  @ApiProperty({ default: 'ofWetStamps...', nullable: true })
  ofWetStamps: string | null

  @ApiProperty({ enum: ANSI, default: ANSI.ANSI_B, nullable: true })
  wetStampSize: string | null

  @ApiProperty({ default: 'engineeringNotes...', nullable: true })
  engineeringNotes: string | null
}

export class ElectricalEngineering {
  @ApiProperty({ default: 'electricalNotes...', nullable: true })
  electricalNotes: string | null
}

export class Additional {
  @ApiProperty({ default: 'geoId...', nullable: true })
  geoId: string | null

  @ApiProperty({ default: 'geoIdState...', nullable: true })
  geoIdState: string | null

  @ApiProperty({ default: 'geoIdCounty...', nullable: true })
  geoIdCounty: string | null

  @ApiProperty({ default: 'geoIdCountySubdivision...', nullable: true })
  geoIdCountySubdivision: string | null

  @ApiProperty({ default: 'geoIdPlace...', nullable: true })
  geoIdPlace: string | null

  @ApiProperty({ default: 'fullAhjName...', nullable: true })
  fullAhjName: string | null

  @ApiProperty({ default: 'funcStat...', nullable: true })
  funcStat: string | null

  @ApiProperty({ default: 'address...', nullable: true })
  address: string | null

  @ApiProperty({ default: 'lsadCode...', nullable: true })
  lsadCode: string | null

  @ApiProperty({ default: 'usps...', nullable: true })
  usps: string | null

  @ApiProperty({ default: 'ansiCode...', nullable: true })
  ansiCode: string | null
}

export class AhjNoteResponseDto {
  general: General
  design: Design
  engineering: Engineering
  electricalEngineering: ElectricalEngineering
}
