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

    /**
     * 1. 조회한다.
     * 2. 없으면 생성
     * 3. 데이터 다르면 업데이트
     */
    const existedState = await this.prismaService.states.findFirst({ where: { stateName: state.geoId } })
    if (!existedState) {
      await this.prismaService.states.create({ data: { ...state } })
    }

    /**
     * 1. 조회한다.
     * 2. 없으면 생성
     * 3. 데이터 다르면 업데이트
     */
    const stateNote = await this.prismaService.aHJNotes.findFirst({ where: { geoId: state.geoId } })
    if (stateNote && stateNote?.type !== type.STATE) {
      await this.prismaService.aHJNotes.update({
        data: { ...state.getNoteInputData() },
        where: { geoId: state.geoId },
      })
      await this.prismaService.aHJNoteHistory.create({ data: { ...stateNote } })
    }

    if (!stateNote) {
      await this.prismaService.aHJNotes.create({ data: { ...state.getNoteInputData() } })
    }

    const existedCountie = await this.prismaService.counties.findFirst({ where: { geoId: county.geoId } })
    // Create Counties
    if (!existedCountie) {
      await this.prismaService.counties.create({ data: { ...county } })
    }

    // Update Counties Notes
    const countyNote = await this.prismaService.aHJNotes.findFirst({ where: { geoId: county.geoId } })
    if (countyNote && countyNote?.type !== type.COUNTY) {
      await this.prismaService.aHJNotes.update({
        data: { ...county.getNoteInputData(state) },
        where: { geoId: county.geoId },
      })
      await this.prismaService.aHJNoteHistory.create({ data: { ...countyNote } })
    }

    // Generate Counties Notes
    if (!countyNote) {
      await this.prismaService.aHJNotes.create({ data: { ...county.getNoteInputData(state) } })
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

    // Update County Subdivisions Notes
    if (countySubdivisionsNotes && countySubdivisionsNotes?.type !== type.COUNTY_SUBDIVISIONS) {
      await this.prismaService.aHJNotes.update({
        data: { ...countySubdivisions.getNoteInputData(state, county) },
        where: { geoId: countySubdivisions.geoId },
      })
      await this.prismaService.aHJNoteHistory.create({ data: { ...countySubdivisionsNotes } })
    }

    // Generate County Subdivisions Notes
    if (!countySubdivisionsNotes) {
      await this.prismaService.aHJNotes.create({ data: { ...countySubdivisions.getNoteInputData(state, county) } })
    }

    // Find Place
    const existedPlace = await this.prismaService.places.findFirst({ where: { geoId: place.geoId } })
    // Create Place
    if (!existedPlace) {
      await this.prismaService.places.create({ data: { ...place } })
    }

    // Update Place Notes
    const placeNotes = await this.prismaService.aHJNotes.findFirst({ where: { geoId: place.geoId } })
    if (placeNotes && placeNotes?.type !== type.PLACE) {
      await this.prismaService.aHJNotes.update({
        data: { ...place.getNoteInputData(state, county, countySubdivisions) },
        where: { geoId: place.geoId },
      })
      await this.prismaService.aHJNoteHistory.create({ data: { ...placeNotes } })
    }

    // Generate Place Notes
    if (!placeNotes) {
      await this.prismaService.aHJNotes.create({
        data: { ...place.getNoteInputData(state, county, countySubdivisions) },
      })
    }
  }
}
