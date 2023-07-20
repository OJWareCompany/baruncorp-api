import got from 'got'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../database/prisma.service'
import { AddressFromMapBox } from './infra/census/census.type'
import { CensusResponseDto } from './infra/census/census.response'

const type = {
  STATE: 'STATE',
  COUNTY: 'COUNTY',
  COUNTY_SUBDIVISIONS: 'COUNTY SUBDIVISIONS',
  PLACE: 'PLACE',
}

@Injectable()
export class ProjectService {
  // prisma Service같은 공통적으로 쓰일수 있는 모듈은 어떻게 관리하는가?
  constructor(private readonly prismaService: PrismaService) {}
  async createProject(createProjectDto: AddressFromMapBox) {
    const { state, postalCode, city, street1, street2 } = createProjectDto
    const baseUrl = 'https://geocoding.geo.census.gov'
    const path = '/geocoder/geographies/address'
    const query = `?street=${
      street1 || 'none'
    } ${street2}&city=${city}&state=${state}&zip=${postalCode}&benchmark=4&vintage=4&format=json`

    const response = await got.get(`${baseUrl}${path}${query}`).json()
    const hasAddressMatches = !!response['result']['addressMatches'][0]
    const censusResponse = hasAddressMatches ? new CensusResponseDto(response) : undefined
    await this.generateGeographyAndAhjNotes(censusResponse)
  }

  async generateGeographyAndAhjNotes(censusResponseDto: CensusResponseDto) {
    const { state, county, countySubdivisions, place, address, zip } = censusResponseDto

    // Find State
    const existedState = await this.prismaService.states.findFirst({ where: { stateName: state.stateName } })

    // TODO: 값이 다르면 업데이트
    // Create State
    if (!existedState) {
      await this.prismaService.states.create({ data: { ...state } })
    }

    const copyState = { ...state }
    delete copyState['stateName']
    delete copyState['abbreviation']
    delete copyState['stateLongName']
    // Update State Notes
    const stateNote = await this.prismaService.aHJNotes.findFirst({ where: { geoId: state.geoId } })
    if (stateNote && stateNote?.type !== type.STATE) {
      await this.prismaService.aHJNotes.update({
        data: {
          ...copyState,
          geoId: state.geoId,
          geoIdState: state.geoId,
          name: state.stateName,
          fullAhjName: state.stateLongName,
          longName: state.stateLongName,
          usps: state.abbreviation,
          type: type.STATE,
        },
        where: { geoId: state.geoId },
      })
      await this.prismaService.aHJNoteHistory.create({ data: { ...stateNote } })
    }

    // Generate stateNote
    if (!stateNote) {
      await this.prismaService.aHJNotes.create({
        data: {
          ...copyState,
          geoId: state.geoId,
          geoIdState: state.geoId,
          name: state.stateName,
          fullAhjName: state.stateLongName,
          longName: state.stateLongName,
          usps: state.abbreviation,
          type: type.STATE,
        },
      })
    }

    // Find Counties
    const existedCountie = await this.prismaService.counties.findFirst({ where: { geoId: county.geoId } })

    const copyCounty = { ...county }
    delete copyCounty['countyName']
    delete copyCounty['countyLongName']

    // Create Counties
    if (!existedCountie) {
      await this.prismaService.counties.create({ data: { ...county } })
    }

    // Update Counties Notes
    const countyNote = await this.prismaService.aHJNotes.findFirst({ where: { geoId: county.geoId } })
    if (countyNote && countyNote?.type !== type.COUNTY) {
      await this.prismaService.aHJNotes.update({
        data: {
          ...copyCounty,
          geoId: county.geoId,
          geoIdState: state.geoId,
          geoIdCounty: county.geoId,
          name: county.countyName,
          fullAhjName: county.countyLongName,
          longName: county.countyLongName,
          type: type.COUNTY,
        },
        where: { geoId: county.geoId },
      })
      await this.prismaService.aHJNoteHistory.create({ data: { ...countyNote } })
    }

    // Generate Counties Notes
    if (!countyNote) {
      await this.prismaService.aHJNotes.create({
        data: {
          ...copyCounty,
          geoId: county.geoId,
          geoIdState: state.geoId,
          geoIdCounty: county.geoId,
          name: county.countyName,
          fullAhjName: county.countyLongName,
          longName: county.countyLongName,
          type: type.COUNTY,
        },
      })
    }

    // Find County Subdivisions
    const existedSubdivisions = await this.prismaService.countySubdivisions.findFirst({
      where: { geoId: countySubdivisions.geoId },
    })

    // Create County Subdivisions
    if (!existedSubdivisions) {
      await this.prismaService.countySubdivisions.create({ data: { ...countySubdivisions } })
    }

    // Find Subdivisions Notes
    const countySubdivisionsNotes = await this.prismaService.aHJNotes.findFirst({
      where: { geoId: countySubdivisions.geoId },
    })

    const copyCountySubdivisions = { ...countySubdivisions }

    // Update County Subdivisions Notes
    if (countySubdivisionsNotes && countySubdivisionsNotes?.type !== type.COUNTY_SUBDIVISIONS) {
      await this.prismaService.aHJNotes.update({
        data: {
          ...copyCountySubdivisions,
          geoId: countySubdivisions.geoId,
          geoIdState: state.geoId,
          geoIdCounty: county.geoId,
          geoIdCountySubdivision: countySubdivisions.geoId,
          name: countySubdivisions.name,
          fullAhjName: countySubdivisions.longName,
          longName: countySubdivisions.longName,
          type: type.COUNTY_SUBDIVISIONS,
        },
        where: { geoId: countySubdivisions.geoId },
      })
      await this.prismaService.aHJNoteHistory.create({ data: { ...countySubdivisionsNotes } })
    }

    // Generate County Subdivisions Notes
    if (!countySubdivisionsNotes) {
      await this.prismaService.aHJNotes.create({
        data: {
          ...countySubdivisions,
          geoId: countySubdivisions.geoId,
          geoIdState: state.geoId,
          geoIdCounty: county.geoId,
          geoIdCountySubdivision: countySubdivisions.geoId,
          name: countySubdivisions.name,
          fullAhjName: countySubdivisions.longName,
          longName: countySubdivisions.longName,
          type: type.COUNTY_SUBDIVISIONS,
        },
      })
    }

    // Find Place
    const existedPlace = await this.prismaService.places.findFirst({ where: { geoId: place.geoId } })
    // Create Place
    if (!existedPlace) {
      await this.prismaService.places.create({ data: { ...place } })
    }

    const placeCopy = { ...place }
    delete placeCopy['placeName']
    delete placeCopy['placeFips']
    delete placeCopy['placeLongName']
    delete placeCopy['placeC']

    // Update Place Notes
    const placeNotes = await this.prismaService.aHJNotes.findFirst({ where: { geoId: place.geoId } })
    if (placeNotes && placeNotes?.type !== type.PLACE) {
      await this.prismaService.aHJNotes.update({
        data: {
          ...placeCopy,
          geoId: place.geoId,
          geoIdState: state.geoId,
          geoIdCounty: county.geoId,
          geoIdCountySubdivision: countySubdivisions.geoId,
          geoIdPlace: place.geoId,
          name: place.placeName,
          fullAhjName: place.placeLongName,
          longName: place.placeLongName,
          type: type.PLACE,
        },
        where: { geoId: place.geoId },
      })
      await this.prismaService.aHJNoteHistory.create({ data: { ...placeNotes } })
    }

    // Generate Place Notes
    if (!placeNotes) {
      await this.prismaService.aHJNotes.create({
        data: {
          ...placeCopy,
          geoId: place.geoId,
          geoIdState: place.stateCode,
          name: place.placeName,
          fullAhjName: place.placeLongName,
          longName: place.placeLongName,
          type: type.PLACE,
        },
      })
    }
  }
}

/**
 *
{
  "street1": "1475 La Perla Ave",
  "street2": "1동 202호",
  "city": "Long Beach",
  "state": "California",
  "postalCode": "90815"
}
 */
