/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Injectable } from '@nestjs/common'
import { GoogleAhjNotesFolder, Prisma } from '@prisma/client'
import { AhjNoteFolderData, AhjNoteFolderOperationResult } from '../../../filesystem/infra/filesystem.api.type'
import { CensusResponseDto } from '../../../project/infra/census/census.response.dto'
import {
  CensusCounties,
  CensusCountySubdivisions,
  CensusPlace,
  CensusState,
} from '../../../project/infra/census/census.type.dto'
import { AHJType } from '../../dto/ahj-note.response.dto'
import { PrismaService } from '../../../database/prisma.service'
import { FilesystemApiService } from '../../../filesystem/infra/filesystem.api.service'

type PrismaOperation = {
  name: string
  operation: Prisma.PrismaPromise<any>
}

@Injectable()
export class GenerateCensusResourceDomainService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly filesystemApiService: FilesystemApiService,
  ) {}

  async generateGeographyAndAhjNotes(censusResponseDto: CensusResponseDto) {
    const { state, county, countySubdivisions, place } = censusResponseDto

    const prismaOperations: PrismaOperation[] = []
    const ahjNoteFolderDatas: AhjNoteFolderData[] = []

    /**
     * State & Notes
     */
    if (state) {
      // await this.geographyRepository.createState(state)
      await this.addCreateStateOperation(state, prismaOperations)
      // await this.geographyRepository.updateStateNote(state)
      await this.addCreateOrUpdateStateNoteOperation(state, prismaOperations)

      const stateAhjNoteFolderData = await this.getStateAhjNoteFolderData(state)
      ahjNoteFolderDatas.push(stateAhjNoteFolderData)
    }

    /**`
     * County & Notes
     */

    if (county) {
      // await this.geographyRepository.createCounty(county)
      await this.addCreateCountyOperation(county, prismaOperations)
      // await this.geographyRepository.updateCountyNote(county, state)
      await this.addCreateOrUpdateCountyNoteOperation(county, state, prismaOperations)

      const countyAhjNoteFolderData = await this.getCountyAhjNoteFolderData(county)
      ahjNoteFolderDatas.push(countyAhjNoteFolderData)
    }

    /**
     * County Subdivisions & Note
     */
    if (countySubdivisions) {
      // await this.geographyRepository.createCountySubdivisions(countySubdivisions)
      await this.addCreateCountySubdivisionsOperation(countySubdivisions, prismaOperations)
      // await this.geographyRepository.updateCountySubdivisionsNote(countySubdivisions, state, county)
      await this.addCreateOrUpdateCountySubdivisionsNoteOperation(countySubdivisions, state, county, prismaOperations)

      const countySubdivisionsAhjNoteFolderData = await this.getCountySubdivisionsAhjNoteFolderData(countySubdivisions)
      ahjNoteFolderDatas.push(countySubdivisionsAhjNoteFolderData)
    }

    /**
     * Place & Note
     */
    if (place) {
      // await this.geographyRepository.createPlace(place)
      await this.addCreatePlaceOperation(place, prismaOperations)
      // await this.geographyRepository.updatePlaceNote(place, state, county, countySubdivisions)
      await this.addCreateOrUpdatePlaceNoteOperation(place, state, county, countySubdivisions, prismaOperations)

      const placeAhjNoteFolderData = await this.getPlaceAhjNoteFolderData(place)
      ahjNoteFolderDatas.push(placeAhjNoteFolderData)
    }

    /**
     * 파일 서버로 AHJ Note Folder 생성 및 업데이트 하라는 요청 이후 데이터베이스의 google_ahj_notes_folder 테이블에 데이터 업데이트하기 위한 연산들을 배열에 추가
     */
    const { ahjNoteFolderOperationResults } = await this.filesystemApiService.requestToCreateOrUpdateAhjNoteFolders({
      ahjNoteFolderDatas,
    })
    for (const result of ahjNoteFolderOperationResults) {
      await this.addAhjNoteFolderOperation(result, prismaOperations)
    }

    try {
      const operations = prismaOperations.map((item) => item.operation)
      await this.prismaService.$transaction(operations)
    } catch (error) {
      await this.filesystemApiService.requestToRollbackCreateOrUpdateAhjNoteFolders({
        ahjNoteFolderOperationResults,
      })
      throw error
    }
  }

  private async addAhjNoteFolderOperation(
    ahjNoteFolderOperationResult: AhjNoteFolderOperationResult,
    prismaOperations: PrismaOperation[],
  ) {
    const existsByGeoId = await this.prismaService.googleAhjNotesFolder.findFirst({
      where: {
        geoId: ahjNoteFolderOperationResult.geoId,
      },
    })
    if (existsByGeoId) {
      prismaOperations.push({
        name: 'updateAhjNotesFolder',
        operation: this.prismaService.$executeRaw<GoogleAhjNotesFolder>`
          UPDATE google_ahj_notes_folder 
          SET id = ${ahjNoteFolderOperationResult.id} 
          WHERE geo_id = ${ahjNoteFolderOperationResult.geoId}
        `,
      })
    } else {
      prismaOperations.push({
        name: 'createAhjNotesFolder',
        operation: this.prismaService.googleAhjNotesFolder.create({
          data: {
            id: ahjNoteFolderOperationResult.id,
            geoId: ahjNoteFolderOperationResult.geoId,
          },
        }),
      })
    }
  }

  private async addCreateStateOperation(state: CensusState, prismaOperations: PrismaOperation[]) {
    const existedState = await this.prismaService.states.findFirst({ where: { stateName: state.stateName } })
    if (!existedState) {
      prismaOperations.push({
        name: 'createState',
        operation: this.prismaService.states.create({ data: { ...state } }),
      })
    }
  }

  private async addCreateCountyOperation(county: CensusCounties, prismaOperations: PrismaOperation[]) {
    const existedCountie = await this.prismaService.counties.findFirst({ where: { geoId: county.geoId } })
    if (!existedCountie) {
      prismaOperations.push({
        name: 'createCounties',
        operation: this.prismaService.counties.create({ data: { ...county } }),
      })
    }
  }

  private async addCreateCountySubdivisionsOperation(
    countySubdivisions: CensusCountySubdivisions,
    prismaOperations: PrismaOperation[],
  ) {
    const existedSubdivisions = await this.prismaService.countySubdivisions.findFirst({
      where: { geoId: countySubdivisions.geoId },
    })
    if (!existedSubdivisions) {
      prismaOperations.push({
        name: 'createCountySubdivisions',
        operation: this.prismaService.countySubdivisions.create({ data: { ...countySubdivisions } }),
      })
    }
  }

  private async addCreatePlaceOperation(place: CensusPlace, prismaOperations: PrismaOperation[]) {
    const existedPlace = await this.prismaService.places.findFirst({ where: { geoId: place.geoId } })
    if (!existedPlace) {
      prismaOperations.push({
        name: 'createPlaces',
        operation: this.prismaService.places.create({ data: { ...place } }),
      })
    }
  }

  private async addCreateOrUpdateStateNoteOperation(state: CensusState, prismaOperations: PrismaOperation[]) {
    const stateNoteData = { ...state.getNoteInputData() }
    const existedStateNote = await this.prismaService.aHJNotes.findFirst({ where: { geoId: state.geoId } })

    if (existedStateNote && existedStateNote?.type !== AHJType.STATE) {
      prismaOperations.push({
        name: 'updateStateAhjNote',
        operation: this.prismaService.aHJNotes.update({
          data: stateNoteData,
          where: { geoId: state.geoId },
        }),
      })
      prismaOperations.push({
        name: 'createStateAhjNoteHistory',
        operation: this.prismaService.aHJNoteHistory.create({ data: { ...existedStateNote } }),
      })
    }

    if (!existedStateNote) {
      prismaOperations.push({
        name: 'createStateAhjNote',
        operation: this.prismaService.aHJNotes.create({ data: stateNoteData }),
      })
    }
  }

  private async addCreateOrUpdateCountyNoteOperation(
    county: CensusCounties,
    state: CensusState,
    prismaOperations: PrismaOperation[],
  ) {
    const countyNoteData = { ...county.getNoteInputData(state) }
    const existedCountyNote = await this.prismaService.aHJNotes.findFirst({ where: { geoId: county.geoId } })

    if (existedCountyNote && existedCountyNote?.type !== AHJType.COUNTY) {
      prismaOperations.push({
        name: 'updateCountyAhjNote',
        operation: this.prismaService.aHJNotes.update({
          data: countyNoteData,
          where: { geoId: county.geoId },
        }),
      })
      prismaOperations.push({
        name: 'createCountyAhjNoteHistory',
        operation: this.prismaService.aHJNoteHistory.create({ data: { ...existedCountyNote } }),
      })
    }

    if (!existedCountyNote) {
      prismaOperations.push({
        name: 'createCountyAhjNote',
        operation: this.prismaService.aHJNotes.create({ data: countyNoteData }),
      })
    }
  }

  private async addCreateOrUpdateCountySubdivisionsNoteOperation(
    countySubdivisions: CensusCountySubdivisions,
    state: CensusState,
    county: CensusCounties,
    prismaOperations: PrismaOperation[],
  ) {
    const countySubdivisionsNoteData = { ...countySubdivisions.getNoteInputData(state, county) }
    const existedCountySubdivisionsNotes = await this.prismaService.aHJNotes.findFirst({
      where: { geoId: countySubdivisions.geoId },
    })

    if (existedCountySubdivisionsNotes && existedCountySubdivisionsNotes?.type !== AHJType.COUNTY_SUBDIVISIONS) {
      prismaOperations.push({
        name: 'updateCountySubdivisionsAhjNote',
        operation: this.prismaService.aHJNotes.update({
          data: countySubdivisionsNoteData,
          where: { geoId: countySubdivisions.geoId },
        }),
      })
      prismaOperations.push({
        name: 'createCountySubdivisionsAhjNoteHistory',
        operation: this.prismaService.aHJNoteHistory.create({ data: { ...existedCountySubdivisionsNotes } }),
      })
    }

    if (!existedCountySubdivisionsNotes) {
      prismaOperations.push({
        name: 'createCountySubdivisionsNotes',
        operation: this.prismaService.aHJNotes.create({ data: countySubdivisionsNoteData }),
      })
    }
  }

  private async addCreateOrUpdatePlaceNoteOperation(
    place: CensusPlace,
    state: CensusState,
    county: CensusCounties,
    subdivision: CensusCountySubdivisions | null,
    prismaOperations: PrismaOperation[],
  ) {
    const placeNoteData = { ...place.getNoteInputData(state, county, subdivision) }
    const placeNotes = await this.prismaService.aHJNotes.findFirst({ where: { geoId: place.geoId } })

    if (placeNotes && placeNotes?.type !== AHJType.PLACE) {
      prismaOperations.push({
        name: 'updatePlaceAhjNote',
        operation: this.prismaService.aHJNotes.update({
          data: placeNoteData,
          where: { geoId: place.geoId },
        }),
      })
      prismaOperations.push({
        name: 'createPlaceAhjNoteHistory',
        operation: this.prismaService.aHJNoteHistory.create({ data: { ...placeNotes } }),
      })
    }

    if (!placeNotes) {
      prismaOperations.push({
        name: 'createPlaceAhjNote',
        operation: this.prismaService.aHJNotes.create({
          data: placeNoteData,
        }),
      })
    }
  }

  private async getPlaceAhjNoteFolderData(place: CensusPlace): Promise<AhjNoteFolderData> {
    const placeAhjNoteFolder = await this.prismaService.googleAhjNotesFolder.findFirst({
      where: { geoId: place.geoId },
    })
    const fullAhjName = place.placeLongName
    return this.getAhjNoteFolderData({
      folderId: placeAhjNoteFolder?.id ?? null,
      name: fullAhjName,
      geoId: place.geoId,
    })
  }

  private async getCountySubdivisionsAhjNoteFolderData(
    countySubdivisions: CensusCountySubdivisions,
  ): Promise<AhjNoteFolderData> {
    const countySubdivisionsAhjNoteFolder = await this.prismaService.googleAhjNotesFolder.findFirst({
      where: { geoId: countySubdivisions.geoId },
    })
    const fullAhjName = countySubdivisions.longName
    return this.getAhjNoteFolderData({
      folderId: countySubdivisionsAhjNoteFolder?.id ?? null,
      name: fullAhjName,
      geoId: countySubdivisions.geoId,
    })
  }

  private async getCountyAhjNoteFolderData(county: CensusCounties): Promise<AhjNoteFolderData> {
    const countyAhjNoteFolder = await this.prismaService.googleAhjNotesFolder.findFirst({
      where: { geoId: county.geoId },
    })
    const fullAhjName = county.countyLongName
    return this.getAhjNoteFolderData({
      folderId: countyAhjNoteFolder?.id ?? null,
      name: fullAhjName,
      geoId: county.geoId,
    })
  }

  private async getStateAhjNoteFolderData(state: CensusState): Promise<AhjNoteFolderData> {
    const stateAhjNoteFolder = await this.prismaService.googleAhjNotesFolder.findFirst({
      where: { geoId: state.geoId },
    })
    const fullAhjName = state.stateLongName
    return this.getAhjNoteFolderData({
      folderId: stateAhjNoteFolder?.id ?? null,
      name: fullAhjName,
      geoId: state.geoId,
    })
  }

  private getAhjNoteFolderData({
    folderId,
    name,
    geoId,
  }: {
    folderId: string | null
    name: string
    geoId: string
  }): AhjNoteFolderData {
    if (folderId) {
      return {
        operation: 'update-ahj',
        data: {
          folderId,
          updateName: name,
          geoId,
        },
      }
    }

    return {
      operation: 'create-ahj',
      data: {
        createName: name,
        geoId: geoId,
      },
    }
  }
}
