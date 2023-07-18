import { Injectable } from '@nestjs/common'
import { GeographyRepositoryPort } from './geography.repository.port'
import { AHJNotes } from '@prisma/client'
import { PrismaService } from '../../database/prisma.service'
import { Page } from '../../common/helpers/pagination/page'

export type AHJNotesModel = AHJNotes

@Injectable()
export class GeographyRepository implements GeographyRepositoryPort {
  constructor(private readonly prismaService: PrismaService) {}

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
        modifiedBy: true,
        modifiedAt: true,
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

  async updateNote(model: AHJNotes): Promise<void> {
    await this.prismaService.aHJNotes.update({ data: { ...model }, where: { geoId: model.geoId } })
  }
}
