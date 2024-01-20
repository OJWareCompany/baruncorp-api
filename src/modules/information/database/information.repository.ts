import { Injectable } from '@nestjs/common'
import { InformationHistories, Informations } from '@prisma/client'
import { PrismaService } from '../../database/prisma.service'
import { InformationEntity } from '../domain/information.entity'
import { InformationRepositoryPort } from './information.repository.port'
import { InformationMapper } from '../information.mapper'
import { InformationHistoryEntity } from '../domain/information-history.entity'

export type InformationModel = Informations
export type InformationQueryModel = Informations

export type InformationHistoryModel = InformationHistories
@Injectable()
export class InformationRepository implements InformationRepositoryPort {
  constructor(private readonly prismaService: PrismaService, private readonly mapper: InformationMapper) {}

  async insert(entity: InformationEntity): Promise<void> {
    const record: InformationModel = this.mapper.toPersistence(entity)
    await this.prismaService.informations.create({ data: record })
  }

  async insertHistory(entity: InformationHistoryEntity): Promise<void> {
    const record = this.mapper.toHistoryPersistence(entity)
    await this.prismaService.informationHistories.create({
      data: record,
    })
  }

  async update(entity: InformationEntity): Promise<void> {
    const record = this.mapper.toPersistence(entity)
    await this.prismaService.informations.update({ where: { id: entity.id }, data: record })
  }

  async findOne(id: string): Promise<InformationEntity | null> {
    const record: InformationQueryModel | null = await this.prismaService.informations.findUnique({
      where: { id },
    })
    return record ? this.mapper.toDomain(record) : null
  }

  async findMany(offset: number, limit: number): Promise<InformationEntity[]> {
    const records: InformationQueryModel[] = await this.prismaService.informations.findMany({
      skip: offset,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    })

    return records.map((record) => {
      return this.mapper.toDomain(record)
    })
  }

  async getCount(): Promise<number> {
    return await this.prismaService.informations.count()
  }
}
