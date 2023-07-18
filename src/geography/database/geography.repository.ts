import { Injectable } from '@nestjs/common'
import { GeographyRepositoryPort } from './geography.repository.port'
import { AHJNotes } from '@prisma/client'
import { PrismaService } from '../../database/prisma.service'

export type AHJNotesModel = AHJNotes

@Injectable()
export class GeographyRepository implements GeographyRepositoryPort {
  constructor(private readonly prismaService: PrismaService) {}

  async findNotes(): Promise<Partial<AHJNotesModel>[]> {
    return await this.prismaService.aHJNotes.findMany({
      select: {
        geoId: true,
        name: true,
        fullAhjName: true,
        modifiedBy: true,
        createdAt: true,
      },
    })
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
