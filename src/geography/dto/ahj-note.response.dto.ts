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

export class SelectClass {
  @ApiProperty({ enum: SelectOption, default: SelectOption.SeeNotes })
  acDisconnectRequired: string
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
  @ApiProperty({ default: 'https://google.com' })
  website: string

  @ApiProperty({ enum: SelectOption, default: SelectOption.SeeNotes })
  specificFormRequired: string

  @ApiProperty({ default: 'generalNotes...' })
  generalNotes: string

  @ApiProperty({ default: '2015 IBC2' })
  buildingCodes: string

  @ApiProperty({ default: 'Arcata city' })
  name: string

  @ApiProperty({ default: 'Arroyo Grande city, California' })
  fullAhjName: string

  @ApiProperty({ default: new Date().toISOString() })
  createdAt: string

  @ApiProperty({ default: new Date().toISOString() })
  updatedAt: string

  @ApiProperty({ default: new Date().toISOString() })
  updatedBy: string

  @ApiProperty({ enum: AHJType, default: AHJType.COUNTY })
  type: string
}

export class Design {
  @ApiProperty({ default: 'fireSetBack...' })
  fireSetBack: string

  @ApiProperty({ default: 'utilityNotes...' })
  utilityNotes: string

  @ApiProperty({ default: 'designNotes...' })
  designNotes: string

  @ApiProperty({ enum: SelectOption, default: SelectOption.SeeNotes })
  pvMeterRequired: string

  @ApiProperty({ enum: SelectOption, default: SelectOption.SeeNotes })
  acDisconnectRequired: string

  @ApiProperty({ enum: SelectOption, default: SelectOption.SeeNotes })
  centerFed120Percent: string

  @ApiProperty({ default: 'deratedAmpacity...' })
  deratedAmpacity: string
}

export class Engineering {
  @ApiProperty({ enum: SelectOption, default: SelectOption.SeeNotes })
  iebcAccepted: string

  @ApiProperty({ enum: SelectOption, default: SelectOption.SeeNotes })
  structuralObservationRequired: string

  @ApiProperty({ enum: DigitalSignatureType, default: DigitalSignatureType.Certified })
  digitalSignatureType: string

  @ApiProperty({ enum: SelectOption, default: SelectOption.SeeNotes })
  windUpliftCalculationRequired: string

  @ApiProperty({ default: '115' })
  windSpeed: string

  @ApiProperty({ enum: WindExposure, default: WindExposure.SeeNotes })
  windExposure: string

  @ApiProperty({ default: '30' })
  snowLoadGround: string

  @ApiProperty({ default: '30' })
  snowLoadFlatRoof: string

  @ApiProperty({ default: '30' })
  snowLoadSlopedRoof: string

  @ApiProperty({ enum: SelectOption, default: SelectOption.SeeNotes })
  wetStampsRequired: string

  @ApiProperty({ default: 'ofWetStamps...' })
  ofWetStamps: string

  @ApiProperty({ enum: ANSI, default: ANSI.ANSI_B })
  wetStampSize: string

  @ApiProperty({ default: 'engineeringNotes...' })
  engineeringNotes: string
}

export class ElectricalEngineering {
  @ApiProperty({ default: 'electricalNotes...' })
  electricalNotes: string
}

export class Additional {
  @ApiProperty({ default: 'geoId...' })
  geoId: string

  @ApiProperty({ default: 'geoIdState...' })
  geoIdState: string

  @ApiProperty({ default: 'geoIdCounty...' })
  geoIdCounty: string

  @ApiProperty({ default: 'geoIdCountySubdivision...' })
  geoIdCountySubdivision: string

  @ApiProperty({ default: 'geoIdPlace...' })
  geoIdPlace: string

  @ApiProperty({ default: 'fullAhjName...' })
  fullAhjName: string

  @ApiProperty({ default: 'funcStat...' })
  funcStat: string

  @ApiProperty({ default: 'address...' })
  address: string

  @ApiProperty({ default: 'lsadCode...' })
  lsadCode: string

  @ApiProperty({ default: 'usps...' })
  usps: string

  @ApiProperty({ default: 'ansiCode...' })
  ansiCode: string
}

export class AhjNoteResponseDto {
  general: General
  design: Design
  engineering: Engineering
  electricalEngineering: ElectricalEngineering
}
