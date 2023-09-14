import { Exclude, Expose } from 'class-transformer'
import { IsArray } from 'class-validator'
import { AHJType } from '../../../geography/dto/ahj-note.response.dto'
import { ApiProperty } from '@nestjs/swagger'

export class AddressFromMapBox {
  @ApiProperty({ default: [12.1, 22.2] })
  @IsArray()
  readonly coordinates: number[]
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
    const copyState: {
      ansiCode: string
      stateName?: string
      funcStat: string
      geoId: string
      lsadCode: string
      stateLongName?: string
      stateCode: string
      abbreviation?: string
    } = { ...this }
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
    const copyCounty: {
      ansiCode: string
      countyName?: string
      countyCode: string
      funcStat: string
      geoId: string
      lsadCode: string
      countyLongName?: string
      stateCode: string
    } = { ...this }
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

  getNoteInputData(state: CensusState, county: CensusCounties, countySubdivisions: CensusCountySubdivisions | null) {
    const placeCopy: {
      placeName?: string
      funcStat: string
      geoId: string
      lsadCode: string
      placeLongName?: string
      placeFips?: string
      placeC?: string
      ansiCode: string
      stateCode: string
    } = { ...this }

    delete placeCopy['placeName']
    delete placeCopy['placeFips']
    delete placeCopy['placeLongName']
    delete placeCopy['placeC']
    return {
      ...placeCopy,
      geoId: this.geoId,
      geoIdState: state.geoId,
      geoIdCounty: county.geoId,
      geoIdCountySubdivision: countySubdivisions?.geoId || null,
      geoIdPlace: this.geoId,
      name: this.placeName,
      fullAhjName: this.placeLongName,
      longName: this.placeLongName,
      type: AHJType.PLACE,
    }
  }
}
