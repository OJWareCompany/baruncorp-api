import { Injectable } from '@nestjs/common'
import { GeographyRepositoryPort } from './geography.repository.port'
import { AHJNoteHistory, AHJNotes } from '@prisma/client'
import { PrismaService } from '../../database/prisma.service'
import { Page } from '../../common/helpers/pagination/page.res.dto'
import {
  CensusState,
  CensusCounties,
  CensusCountySubdivisions,
  CensusPlace,
} from '../../project/infra/census/census.type.dto'
import { AHJType } from '../types/ahj.type'

export type AHJNotesModel = AHJNotes
export type AHJNoteHistoryModel = AHJNoteHistory

@Injectable()
export class GeographyRepository implements GeographyRepositoryPort {
  constructor(private readonly prismaService: PrismaService) {}

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
      await this.prismaService.aHJNotes.update({
        data: { ...create.getNoteInputData() },
        where: { geoId: create.geoId },
      })
      await this.prismaService.aHJNoteHistory.create({ data: { ...existedStateNote } })
    }

    if (!existedStateNote) {
      await this.prismaService.aHJNotes.create({ data: { ...create.getNoteInputData() } })
    }
  }

  async updateCountyNote(create: CensusCounties, state: CensusState): Promise<void> {
    const existedCountyNote = await this.prismaService.aHJNotes.findFirst({ where: { geoId: create.geoId } })
    if (existedCountyNote && existedCountyNote?.type !== AHJType.COUNTY) {
      await this.prismaService.aHJNotes.update({
        data: { ...create.getNoteInputData(state) },
        where: { geoId: create.geoId },
      })
      await this.prismaService.aHJNoteHistory.create({ data: { ...existedCountyNote } })
    }

    if (!existedCountyNote) {
      await this.prismaService.aHJNotes.create({ data: { ...create.getNoteInputData(state) } })
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
      await this.prismaService.aHJNotes.update({
        data: { ...create.getNoteInputData(state, county) },
        where: { geoId: create.geoId },
      })
      await this.prismaService.aHJNoteHistory.create({ data: { ...existedCountySubdivisionsNotes } })
    }

    if (!existedCountySubdivisionsNotes) {
      await this.prismaService.aHJNotes.create({ data: { ...create.getNoteInputData(state, county) } })
    }
  }

  async updatePlaceNote(
    create: CensusPlace,
    state: CensusState,
    county: CensusCounties,
    subdivision: CensusCountySubdivisions,
  ): Promise<void> {
    const placeNotes = await this.prismaService.aHJNotes.findFirst({ where: { geoId: create.geoId } })
    if (placeNotes && placeNotes?.type !== AHJType.PLACE) {
      await this.prismaService.aHJNotes.update({
        data: { ...create.getNoteInputData(state, county, subdivision) },
        where: { geoId: create.geoId },
      })
      await this.prismaService.aHJNoteHistory.create({ data: { ...placeNotes } })
    }

    if (!placeNotes) {
      await this.prismaService.aHJNotes.create({
        data: { ...create.getNoteInputData(state, county, subdivision) },
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

  async findNoteUpdateHistoryDetail(historyId: number): Promise<AHJNoteHistory> {
    return await this.prismaService.aHJNoteHistory.findUnique({ where: { id: historyId } })
  }

  async findNoteHistory(pageNo: number, pageSize: number, geoId?: string): Promise<Page<Partial<AHJNoteHistoryModel>>> {
    const offset = (pageNo - 1) * pageSize ?? 0
    const where = geoId ? { geoId: geoId } : undefined

    const count = await this.prismaService.aHJNoteHistory.count({ select: { geoId: true }, where: { ...where } })
    const totalCount = count.geoId

    const result = await this.prismaService.aHJNoteHistory.findMany({
      select: {
        id: true,
        geoId: true,
        name: true,
        fullAhjName: true,
        updatedBy: true,
        updatedAt: true,
      },
      where: { ...where },
      orderBy: {
        modifiedAt: 'desc',
      },
      skip: offset,
      take: pageSize,
    })

    return new Page(totalCount, pageSize, result)
  }

  async findNotes(pageNo: number, pageSize: number, fullAhjName?: string): Promise<Page<Partial<AHJNotesModel>>> {
    const offset = (pageNo - 1) * pageSize ?? 0
    const where = fullAhjName
      ? {
          fullAhjName: {
            contains: fullAhjName,
          },
        }
      : undefined

    const count = await this.prismaService.aHJNotes.count({ select: { geoId: true }, where: { ...where } })
    const totalCount = count.geoId

    const result = await this.prismaService.aHJNotes.findMany({
      select: {
        geoId: true,
        name: true,
        fullAhjName: true,
        updatedBy: true,
        updatedAt: true,
      },
      where: { ...where },
      orderBy: {
        fullAhjName: 'asc', // 수정/생성 날짜 데이터가 없음
      },
      skip: offset,
      take: pageSize,
    })

    return new Page(totalCount, pageSize, result)
  }

  async findNoteByGeoId(geoId: string): Promise<AHJNotesModel> {
    return await this.prismaService.aHJNotes.findUnique({
      where: {
        geoId,
      },
    })
  }

  // TOFIX
  async updateNote(model: AHJNotesModel, update: AHJNotesModel): Promise<void> {
    await this.prismaService.aHJNotes.update({ data: { ...update }, where: { geoId: update.geoId } })
    await this.prismaService.aHJNoteHistory.create({ data: { ...model } })
  }
}
