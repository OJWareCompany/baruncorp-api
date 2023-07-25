import { ApiProperty } from '@nestjs/swagger'
import { AHJType, ANSI, DigitalSignatureType, SelectOption, WindExposure } from '../types/ahj.type'

export class General {
  @ApiProperty({ example: 'https://google.com' })
  website: string

  @ApiProperty({ enum: SelectOption, example: SelectOption.SeeNotes })
  specificFormRequired: string

  @ApiProperty({ example: 'generalNotes...' })
  generalNotes: string

  @ApiProperty({ example: '2015 IBC2' })
  buildingCodes: string

  @ApiProperty({ example: 'Santa Rosa County' })
  name: string

  @ApiProperty({ example: new Date().toISOString() })
  createdAt: string

  @ApiProperty({ example: new Date().toISOString() })
  updatedAt: string

  @ApiProperty({ example: new Date().toISOString() })
  updatedBy: string

  @ApiProperty({ enum: AHJType, example: AHJType.COUNTY })
  type: string
}

export class Design {
  @ApiProperty({ example: 'fireSetBack...' })
  fireSetBack: string

  @ApiProperty({ example: 'utilityNotes...' })
  utilityNotes: string

  @ApiProperty({ example: 'designNotes...' })
  designNotes: string

  @ApiProperty({ enum: SelectOption, example: SelectOption.SeeNotes })
  pvMeterRequired: string

  @ApiProperty({ enum: SelectOption, example: SelectOption.SeeNotes })
  acDisconnectRequired: string

  @ApiProperty({ enum: SelectOption, example: SelectOption.SeeNotes })
  centerFed120Percent: string

  @ApiProperty({ example: 'deratedAmpacity...' })
  deratedAmpacity: string
}

export class Engineering {
  @ApiProperty({ enum: SelectOption, example: SelectOption.SeeNotes })
  iebcAccepted: string

  @ApiProperty({ enum: SelectOption, example: SelectOption.SeeNotes })
  structuralObservationRequired: string

  @ApiProperty({ enum: DigitalSignatureType, example: DigitalSignatureType.Certified })
  digitalSignatureType: string

  @ApiProperty({ enum: SelectOption, example: SelectOption.SeeNotes })
  windUpliftCalculationRequired: string

  @ApiProperty({ example: '115' })
  windSpeed: string

  @ApiProperty({ enum: WindExposure, example: WindExposure.SeeNotes })
  windExposure: string

  @ApiProperty({ example: '30' })
  snowLoadGround: string

  @ApiProperty({ example: '30' })
  snowLoadFlatRoof: string

  @ApiProperty({ example: '30' })
  snowLoadSlopedRoof: string

  @ApiProperty({ enum: SelectOption, example: SelectOption.SeeNotes })
  wetStampsRequired: string

  @ApiProperty({ example: 'ofWetStamps...' })
  ofWetStamps: string

  @ApiProperty({ enum: ANSI, example: ANSI.ANSI_B })
  wetStampSize: string

  @ApiProperty({ example: 'engineeringNotes...' })
  engineeringNotes: string
}

export class ElectricalEngineering {
  @ApiProperty({ example: 'electricalNotes...' })
  electricalNotes: string
}

export class Additional {
  @ApiProperty({ example: 'geoId...' })
  geoId: string

  @ApiProperty({ example: 'geoIdState...' })
  geoIdState: string

  @ApiProperty({ example: 'geoIdCounty...' })
  geoIdCounty: string

  @ApiProperty({ example: 'geoIdCountySubdivision...' })
  geoIdCountySubdivision: string

  @ApiProperty({ example: 'geoIdPlace...' })
  geoIdPlace: string

  @ApiProperty({ example: 'fullAhjName...' })
  fullAhjName: string

  @ApiProperty({ example: 'funcStat...' })
  funcStat: string

  @ApiProperty({ example: 'address...' })
  address: string

  @ApiProperty({ example: 'lsadCode...' })
  lsadCode: string

  @ApiProperty({ example: 'usps...' })
  usps: string

  @ApiProperty({ example: 'ansiCode...' })
  ansiCode: string
}
