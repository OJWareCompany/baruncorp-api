import { Injectable } from '@nestjs/common'
import { GeographyRepositoryPort } from './geography.repository.port'
import { AHJNoteHistory, AHJNotes, Prisma } from '@prisma/client'
import { PrismaService } from '../../database/prisma.service'
import {
  CensusState,
  CensusCounties,
  CensusCountySubdivisions,
  CensusPlace,
} from '../../project/infra/census/census.type.dto'
import { FindAhjNotesSearchQueryRequestDto } from '../queries/find-ahj-notes/find-ahj-notes-search-query.request.dto'
import { UpdateAhjNoteCommand } from '../commands/update-ahj-note/update-ahj-note.command'
import { AHJType } from '../dto/ahj-note.response.dto'
import { Paginated } from '../../../libs/ddd/repository.port'
import {
  AhjJobNoteNotFoundException,
  AhjNoteHistoryNotFoundException,
  AhjNoteNotFoundException,
} from '../domain/ahj-job-note.error'
import { AhjNoteHistoryTypeEnum } from '../domain/ahj-job-note.type'

export type AHJNotesModel = AHJNotes
export type AHJNoteHistoryModel = AHJNoteHistory

@Injectable()
export class GeographyRepository implements GeographyRepositoryPort {
  constructor(private readonly prismaService: PrismaService) {}

  async deleteNoteByGeoId(geoId: string): Promise<void> {
    await this.prismaService.aHJNotes.delete({ where: { geoId } })
  }

  /**
   * TODO:
   * 생성과 업데이트 두가지 역할을 한다. (무조건 존재해야하며 하나의 데이터만 존재하기때문에 문제는 없어보임)
   *
   * 노트가 업데이트되고, 이력이 생성되므로 Aggregate로 구현할 수 있다.
   * 그렇다면, 여기에 구현된 로직이 도메인 로직으로 이동하게되나?
   * 도메인 로직에서 데이터 셋팅을 완료하고 응용서비스에서는 트랜잭션을, 그리고 repository에서는 단순히 저장 업데이트만 하게 되나?
   * 어쨋든 하나의 메서드에서 두개 이상의 테이블의 데이터가 생성/수정/제거 될 수 있나?
   *
   * 도메인서비스말고.. Aggregate에서..
   */
  async updateStateNote(create: CensusState): Promise<void> {
    const existedStateNote = await this.prismaService.aHJNotes.findFirst({ where: { geoId: create.geoId } })

    if (existedStateNote && existedStateNote?.type !== AHJType.STATE) {
      const updated = await this.prismaService.aHJNotes.update({
        data: { ...create.getNoteInputData() },
        where: { geoId: create.geoId },
      })
      await this.prismaService.aHJNoteHistory.create({
        data: { ...updated, createdAt: new Date(), history_type: 'Modify' },
      })
    }

    if (!existedStateNote) {
      const newNote = await this.prismaService.aHJNotes.create({ data: { ...create.getNoteInputData() } })
      await this.prismaService.aHJNoteHistory.create({
        data: { ...newNote, createdAt: new Date(), history_type: AhjNoteHistoryTypeEnum.Create },
      })
    }
  }

  async updateCountyNote(create: CensusCounties, state: CensusState): Promise<void> {
    const existedCountyNote = await this.prismaService.aHJNotes.findFirst({ where: { geoId: create.geoId } })
    if (existedCountyNote && existedCountyNote?.type !== AHJType.COUNTY) {
      const updated = await this.prismaService.aHJNotes.update({
        data: { ...create.getNoteInputData(state) },
        where: { geoId: create.geoId },
      })
      await this.prismaService.aHJNoteHistory.create({
        data: {
          ...updated,
          history_type: AhjNoteHistoryTypeEnum.Create,
          createdAt: new Date(),
          // updatedAt: new Date(), // 도대체 이게 왜 에러를 발생시키는거지?
          // updatedAt: '2024-01-25T09:20:11.000Z', // 이렇게 해야만 한다. createdAt이랑 무슨 차이지? pk인것? 아니 그러면 업데이트할때 이력 생성하는 코드에서는 상관없었는데 왜..
        },
      })
    }

    if (!existedCountyNote) {
      const newNote = await this.prismaService.aHJNotes.create({ data: { ...create.getNoteInputData(state) } })
      await this.prismaService.aHJNoteHistory.create({
        data: { ...newNote, createdAt: new Date(), history_type: AhjNoteHistoryTypeEnum.Create },
      })
    }
  }

  async updateCountySubdivisionsNote(
    create: CensusCountySubdivisions,
    state: CensusState,
    county: CensusCounties,
  ): Promise<void> {
    const existedCountySubdivisionsNotes = await this.prismaService.aHJNotes.findFirst({
      where: { geoId: create.geoId },
    })

    if (existedCountySubdivisionsNotes && existedCountySubdivisionsNotes?.type !== AHJType.COUNTY_SUBDIVISIONS) {
      const updated = await this.prismaService.aHJNotes.update({
        data: { ...create.getNoteInputData(state, county) },
        where: { geoId: create.geoId },
      })
      await this.prismaService.aHJNoteHistory.create({
        data: { ...updated, createdAt: new Date(), history_type: 'Modify' },
      })
    }

    if (!existedCountySubdivisionsNotes) {
      const newNote = await this.prismaService.aHJNotes.create({ data: { ...create.getNoteInputData(state, county) } })
      await this.prismaService.aHJNoteHistory.create({
        data: { ...newNote, createdAt: new Date(), history_type: AhjNoteHistoryTypeEnum.Create },
      })
    }
  }

  async updatePlaceNote(
    create: CensusPlace,
    state: CensusState,
    county: CensusCounties,
    subdivision: CensusCountySubdivisions | null,
  ): Promise<void> {
    const placeNotes = await this.prismaService.aHJNotes.findFirst({ where: { geoId: create.geoId } })
    if (placeNotes && placeNotes?.type !== AHJType.PLACE) {
      const updated = await this.prismaService.aHJNotes.update({
        data: { ...create.getNoteInputData(state, county, subdivision) },
        where: { geoId: create.geoId },
      })
      await this.prismaService.aHJNoteHistory.create({
        data: { ...updated, createdAt: new Date(), history_type: AhjNoteHistoryTypeEnum.Modify },
      })
    }

    if (!placeNotes) {
      const newNotes = await this.prismaService.aHJNotes.create({
        data: { ...create.getNoteInputData(state, county, subdivision) },
      })
      await this.prismaService.aHJNoteHistory.create({
        data: { ...newNotes, createdAt: new Date(), history_type: AhjNoteHistoryTypeEnum.Create },
      })
    }
  }

  async createState(create: CensusState): Promise<void> {
    const existedState = await this.prismaService.states.findFirst({ where: { stateName: create.stateName } })
    if (!existedState) {
      await this.prismaService.states.create({ data: { ...create } })
    }
  }

  async createCounty(create: CensusCounties): Promise<void> {
    const existedCountie = await this.prismaService.counties.findFirst({ where: { geoId: create.geoId } })
    if (!existedCountie) {
      await this.prismaService.counties.create({ data: { ...create } })
    }
  }

  async createCountySubdivisions(create: CensusCountySubdivisions): Promise<void> {
    const existedSubdivisions = await this.prismaService.countySubdivisions.findFirst({
      where: { geoId: create.geoId },
    })

    if (!existedSubdivisions) {
      await this.prismaService.countySubdivisions.create({ data: { ...create } })
    }
  }

  async createPlace(create: CensusPlace): Promise<void> {
    const existedPlace = await this.prismaService.places.findFirst({ where: { geoId: create.geoId } })
    if (!existedPlace) {
      await this.prismaService.places.create({ data: { ...create } })
    }
  }

  async findAhjNoteHistoryDetail(geoId: string, updatedAt: Date): Promise<AHJNoteHistory> {
    const result = await this.prismaService.aHJNoteHistory.findUnique({
      where: {
        geoId_updatedAt: {
          geoId: geoId,
          updatedAt: updatedAt,
        },
      },
    })
    if (!result) throw new AhjNoteHistoryNotFoundException()
    return result
  }

  async findAhjNoteBeforeHistoryDetail(model: AHJNoteHistory): Promise<AHJNoteHistory | null> {
    const result = await this.prismaService.aHJNoteHistory.findFirst({
      where: {
        geoId: model.geoId,
        updatedAt: {
          lt: model.updatedAt,
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })
    return result
  }

  async findNoteHistory(
    pageNo: number,
    pageSize: number,
    geoId: string | null,
  ): Promise<Paginated<AHJNoteHistoryModel>> {
    const offset = (pageNo - 1) * pageSize ?? 0
    const where = geoId ? { geoId: geoId } : undefined

    const count = await this.prismaService.aHJNoteHistory.count({ select: { geoId: true }, where: { ...where } })
    const totalCount = count.geoId

    const result = await this.prismaService.aHJNoteHistory.findMany({
      where: { ...where },
      orderBy: {
        updatedAt: 'desc',
      },
      skip: offset,
      take: pageSize,
    })

    return new Paginated({ page: pageNo, totalCount, pageSize, items: result })
  }

  async findNotes(
    searchQuery: FindAhjNotesSearchQueryRequestDto,
    pageNo: number,
    pageSize: number,
  ): Promise<Paginated<AHJNotesModel>> {
    const offset = (pageNo - 1) * pageSize ?? 0

    const whereInput: Prisma.AHJNotesWhereInput = {
      ...(searchQuery.geoId && { geoId: searchQuery.geoId }),
      ...(searchQuery.fullAhjName && { fullAhjName: { contains: searchQuery.fullAhjName } }),
      ...(searchQuery.name && { name: { contains: searchQuery.name } }),
    }

    const result = await this.prismaService.aHJNotes.findMany({
      where: whereInput,
      orderBy: {
        updatedAt: 'desc', // 수정/생성 날짜 데이터가 없음
      },
      skip: offset,
      take: pageSize,
    })

    const count = await this.prismaService.aHJNotes.count({ select: { geoId: true }, where: whereInput })
    const totalCount = count.geoId

    return new Paginated({ page: pageNo, totalCount, pageSize, items: result })
  }

  async findNoteByGeoIdOrThrow(geoId: string): Promise<AHJNotesModel> {
    const result = await this.prismaService.aHJNotes.findUnique({ where: { geoId } })
    if (!result) throw new AhjJobNoteNotFoundException()
    return result
  }

  // TO FIX
  async updateNoteAndCreateHistory(username: string, geoId: string, update: UpdateAhjNoteCommand): Promise<void> {
    const model = await this.prismaService.aHJNotes.findFirst({ where: { geoId } })
    if (!model) throw new AhjNoteNotFoundException()
    const updated = await this.prismaService.aHJNotes.update({
      data: {
        website: update.website,
        specificFormRequired: update.specificFormRequired,
        generalNotes: update.generalNotes,
        buildingCodes: update.buildingCodes,
        fireSetBack: update.fireSetBack,
        utilityNotes: update.utilityNotes,
        designNotes: update.designNotes,
        pvMeterRequired: update.pvMeterRequired,
        acDisconnectRequired: update.acDisconnectRequired,
        centerFed120Percent: update.centerFed120Percent,
        deratedAmpacity: update.deratedAmpacity,
        engineeringNotes: update.engineeringNotes,
        iebcAccepted: update.iebcAccepted,
        structuralObservationRequired: update.structuralObservationRequired,
        windUpliftCalculationRequired: update.windUpliftCalculationRequired,
        wetStampsRequired: update.wetStampsRequired,
        digitalSignatureType: update.digitalSignatureType,
        windExposure: update.windExposure,
        wetStampSize: update.wetStampSize,
        windSpeed: update.windSpeed,
        snowLoadGround: update.snowLoadGround,
        snowLoadFlatRoof: update.snowLoadFlatRoof,
        snowLoadSlopedRoof: update.snowLoadSlopedRoof,
        ofWetStamps: update.ofWetStamps,
        electricalNotes: update.electricalNotes,
        geoId: update.geoId,
        updatedBy: username,
      },
      where: { geoId },
    })
    await this.prismaService.aHJNoteHistory.create({
      data: {
        ...updated,
        history_type: 'Modify',
      },
    })
  }
}
