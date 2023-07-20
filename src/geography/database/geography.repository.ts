import { Injectable } from '@nestjs/common'
import { GeographyRepositoryPort } from './geography.repository.port'
import { AHJNoteHistory, AHJNotes, Counties, CountySubdivisions, Places, States } from '@prisma/client'
import { PrismaService } from '../../database/prisma.service'
import { Page } from '../../common/helpers/pagination/page'

export type AHJNotesModel = AHJNotes
export type AHJNoteHistoryModel = AHJNoteHistory

@Injectable()
export class GeographyRepository implements GeographyRepositoryPort {
  constructor(private readonly prismaService: PrismaService) {}
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

  findStateByGeoId(geoId: string): Promise<States> {
    throw new Error('Method not implemented.')
  }
  findCountiesByGeoId(geoId: string): Promise<Counties> {
    throw new Error('Method not implemented.')
  }
  findCountySubdivisionByGeoId(geoId: string): Promise<CountySubdivisions> {
    throw new Error('Method not implemented.')
  }
  findPlaceByGeoId(geoId: string): Promise<Places> {
    throw new Error('Method not implemented.')
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

  async updateNote(model: AHJNotesModel): Promise<void> {
    await this.prismaService.aHJNotes.update({ data: { ...model }, where: { geoId: model.geoId } })
  }
}
