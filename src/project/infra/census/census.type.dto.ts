import { Exclude, Expose } from 'class-transformer'
import { IsString } from 'class-validator'
import { AHJType } from '../../../geography/dto/ahj-note.response.dto'

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

  getNoteInputData() {
    const copyState = { ...this }
    delete copyState['stateName']
    delete copyState['abbreviation']
    delete copyState['stateLongName']
    return {
      ...copyState,
      geoId: this.geoId,
      geoIdState: this.geoId,
      name: this.stateName,
      fullAhjName: this.stateLongName,
      longName: this.stateLongName,
      usps: this.abbreviation,
      type: AHJType.STATE,
    }
  }
}

export class CensusCounties {
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
  getNoteInputData(state: CensusState) {
    const copyCounty = { ...this }
    delete copyCounty['countyName']
    delete copyCounty['countyLongName']
    return {
      ...copyCounty,
      geoId: this.geoId,
      geoIdState: state.geoId,
      geoIdCounty: this.geoId,
      name: this.countyName,
      fullAhjName: this.countyLongName,
      longName: this.countyLongName,
      type: AHJType.COUNTY,
    }
  }
}

export class CensusCountySubdivisions {
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

  getNoteInputData(state: CensusState, county: CensusCounties) {
    const copyCountySubdivisions = { ...this }
    return {
      ...copyCountySubdivisions,
      geoId: this.geoId,
      geoIdState: state.geoId,
      geoIdCounty: county.geoId,
      geoIdCountySubdivision: this.geoId,
      name: this.name,
      fullAhjName: this.longName,
      longName: this.longName,
      type: AHJType.COUNTY_SUBDIVISIONS,
    }
  }
}

// lsadCode
// counties
export class CensusPlace {
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

  getNoteInputData(state: CensusState, county: CensusCounties, countySubdivisions: CensusCountySubdivisions) {
    const placeCopy = { ...this }
    delete placeCopy['placeName']
    delete placeCopy['placeFips']
    delete placeCopy['placeLongName']
    delete placeCopy['placeC']
    return {
      ...placeCopy,
      geoId: this.geoId,
      geoIdState: state.geoId,
      geoIdCounty: county.geoId,
      geoIdCountySubdivision: countySubdivisions.geoId,
      geoIdPlace: this.geoId,
      name: this.placeName,
      fullAhjName: this.placeLongName,
      longName: this.placeLongName,
      type: AHJType.PLACE,
    }
  }
}
