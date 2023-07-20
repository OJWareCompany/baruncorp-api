import { Exclude, Expose } from 'class-transformer'
import { IsString } from 'class-validator'

export class AddressFromMapBox {
  @IsString()
  street1: string
  @IsString()
  street2: string
  @IsString()
  city: string
  @IsString()
  state: string
  @IsString()
  postalCode: string
}

export class CensusState {
  @Expose({ name: 'STATENS' })
  ansiCode: string
  @Expose({ name: 'BASENAME' })
  stateName: string
  @Expose({ name: 'FUNCSTAT' })
  funcStat: string
  @Expose({ name: 'GEOID' })
  geoId: string
  @Expose({ name: 'LSADC' })
  lsadCode: string
  @Expose({ name: 'NAME' })
  stateLongName: string
  @Expose({ name: 'STATE' })
  stateCode: string
  @Expose({ name: 'STUSAB' })
  abbreviation: string
  @Exclude()
  private AREALAND: number
  @Exclude()
  private AREAWATER: number
  @Exclude()
  private CENTLAT: string
  @Exclude()
  private CENTLON: string
  @Exclude()
  private DIVISION: string
  @Exclude()
  private INTPTLAT: string
  @Exclude()
  private INTPTLON: string
  @Exclude()
  private MTFCC: string
  @Exclude()
  private OBJECTID: number
  @Exclude()
  private OID: string
  @Exclude()
  private REGION: string
}

export class CensusCounties {
  @Expose({ name: 'COUNTYNS' })
  ansiCode: string
  @Expose({ name: 'BASENAME' })
  countyName: string
  @Expose({ name: 'COUNTY' })
  countyCode: string
  @Expose({ name: 'FUNCSTAT' })
  funcStat: string
  @Expose({ name: 'GEOID' })
  geoId: string
  @Expose({ name: 'LSADC' })
  lsadCode: string
  @Expose({ name: 'NAME' })
  countyLongName: string
  @Expose({ name: 'STATE' })
  stateCode: string
  @Exclude()
  private AREALAND: number
  @Exclude()
  private AREAWATER: number
  @Exclude()
  private CENTLAT: string
  @Exclude()
  private CENTLON: string
  @Exclude()
  private COUNTYCC: string
  @Exclude()
  private INTPTLAT: string
  @Exclude()
  private INTPTLON: string
  @Exclude()
  private MTFCC: string
  @Exclude()
  private OBJECTID: number
  @Exclude()
  private OID: string
}

export class CensusCountySubdivisions {
  @Expose({ name: 'COUSUBNS' })
  ansiCode: string
  @Expose({ name: 'BASENAME' })
  name: string
  @Expose({ name: 'COUNTY' })
  countyCode: string
  @Expose({ name: 'FUNCSTAT' })
  funcStat: string
  @Expose({ name: 'GEOID' })
  geoId: string
  @Expose({ name: 'LSADC' })
  lsadCode: string
  @Expose({ name: 'NAME' })
  longName: string
  @Expose({ name: 'STATE' })
  stateCode: string

  @Exclude()
  private MTFCC: string
  @Exclude()
  private AREALAND: number
  @Exclude()
  private AREAWATER: number
  @Exclude()
  private CENTLAT: string
  @Exclude()
  private CENTLON: string
  @Exclude()
  private COUSUB: string
  @Exclude()
  private COUSUBCC: string
  @Exclude()
  private INTPTLAT: string
  @Exclude()
  private INTPTLON: string
  @Exclude()
  private OBJECTID: 16122
  @Exclude()
  private OID: string
}

// lsadCode
// counties
export class CensusPlace {
  @Expose({ name: 'BASENAME' })
  placeName: string
  @Expose({ name: 'FUNCSTAT' })
  funcStat: string
  @Expose({ name: 'GEOID' })
  geoId: string
  @Expose({ name: 'LSADC' })
  lsadCode: string
  @Expose({ name: 'NAME' })
  placeLongName: string
  @Expose({ name: 'PLACE' })
  placeFips: string
  @Expose({ name: 'PLACECC' })
  placeC: string
  @Expose({ name: 'PLACENS' })
  ansiCode: string
  @Expose({ name: 'STATE' })
  stateCode: string

  @Exclude()
  private MTFCC: string
  @Exclude()
  private CBSAPCI: string
  @Exclude()
  private CENTLAT: string
  @Exclude()
  private CENTLON: string
  @Exclude()
  private NECTAPCI: string
  @Exclude()
  private OBJECTID: number
  @Exclude()
  private OID: string
  @Exclude()
  private INTPTLAT: string
  @Exclude()
  private INTPTLON: string
  @Exclude()
  private AREALAND: number
  @Exclude()
  private AREAWATER: number
}
