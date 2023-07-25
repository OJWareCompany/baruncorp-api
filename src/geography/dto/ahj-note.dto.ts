import { ApiProperty } from '@nestjs/swagger'
import { AHJType } from '../types/ahj.type'

type SelectOption = 'No' | 'Yes' | 'See Notes'
type ANSI = 'ANSI A (8.5x11 INCH)' | 'ANSI B (11x17 INCH)' | 'ANSI D (22x34 INCH)' | 'ARCH D (24x36 INCH)' | 'See Notes'
type WindExposure = 'B' | 'C' | 'D' | 'See Notes'
type DigitalSignatureType = 'Certified' | 'Signed'
type Types = 'STATE' | 'COUNTY' | 'COUNTY SUBDIVISIONS' | 'PLACE'

// TOFIX
export class General {
  @ApiProperty({ example: 'http://google.com' })
  website: string

  @ApiProperty({ enum: AHJType, example: AHJType.COUNTY })
  specificFormRequired: string

  @ApiProperty({ example: 'http://google.com' })
  generalNotes: string

  @ApiProperty({ example: 'http://google.com' })
  buildingCodes: string

  @ApiProperty({ example: 'http://google.com' })
  name: string

  @ApiProperty({ example: 'http://google.com' })
  createdAt: string

  @ApiProperty({ example: 'http://google.com' })
  updatedAt: string

  @ApiProperty({ example: 'http://google.com' })
  updatedBy: string

  @ApiProperty({ example: 'http://google.com' })
  type: string
}

export class Design {
  @ApiProperty({ example: 'http://google.com' })
  fireSetBack: string

  @ApiProperty({ example: 'http://google.com' })
  utilityNotes: string

  @ApiProperty({ example: 'http://google.com' })
  designNotes: string

  @ApiProperty({ example: 'http://google.com' })
  pvMeterRequired: string

  @ApiProperty({ example: 'http://google.com' })
  acDisconnectRequired: string

  @ApiProperty({ example: 'http://google.com' })
  centerFed120Percent: string

  @ApiProperty({ example: 'http://google.com' })
  deratedAmpacity: string
}

export class Engineering {
  @ApiProperty({ example: 'http://google.com' })
  iebcAccepted: string

  @ApiProperty({ example: 'http://google.com' })
  structuralObservationRequired: string

  @ApiProperty({ example: 'http://google.com' })
  digitalSignatureType: string

  @ApiProperty({ example: 'http://google.com' })
  windUpliftCalculationRequired: string

  @ApiProperty({ example: 'http://google.com' })
  windSpeed: string

  @ApiProperty({ example: 'http://google.com' })
  windExposure: string

  @ApiProperty({ example: 'http://google.com' })
  snowLoadGround: string

  @ApiProperty({ example: 'http://google.com' })
  snowLoadFlatRoof: string

  @ApiProperty({ example: 'http://google.com' })
  snowLoadSlopedRoof: string

  @ApiProperty({ example: 'http://google.com' })
  wetStampsRequired: string

  @ApiProperty({ example: 'http://google.com' })
  ofWetStamps: string

  @ApiProperty({ example: 'http://google.com' })
  wetStampSize: string

  @ApiProperty({ example: 'http://google.com' })
  engineeringNotes: string
}

export class ElectricalEngineering {
  @ApiProperty({ example: 'http://google.com' })
  electricalNotes: string
}

export class Additional {
  @ApiProperty({ example: 'http://google.com' })
  geoId: string

  @ApiProperty({ example: 'http://google.com' })
  geoIdState: string

  @ApiProperty({ example: 'http://google.com' })
  geoIdCounty: string

  @ApiProperty({ example: 'http://google.com' })
  geoIdCountySubdivision: string

  @ApiProperty({ example: 'http://google.com' })
  geoIdPlace: string

  @ApiProperty({ example: 'http://google.com' })
  fullAhjName: string

  @ApiProperty({ example: 'http://google.com' })
  funcStat: string

  @ApiProperty({ example: 'http://google.com' })
  address: string

  @ApiProperty({ example: 'http://google.com' })
  lsadCode: string

  @ApiProperty({ example: 'http://google.com' })
  usps: string

  @ApiProperty({ example: 'http://google.com' })
  ansiCode: string
}
