import { Injectable } from '@nestjs/common'
import { Prisma, TrackingNumbers } from '@prisma/client'
import { PrismaService } from '../../database/prisma.service'
import { TrackingNumbersMapper } from '../tracking-numbers.mapper'
import { TrackingNumbersEntity } from '../domain/tracking-numbers.entity'
import { TrackingNumbersRepositoryPort } from './tracking-numbers.repository.port'
import { UniqueCouriersException } from '@modules/couriers/domain/couriers.error'
import { AlreadyExistException } from '@modules/tracking-numbers/domain/tracking-numbers.error'

export type TrackingNumbersModel = TrackingNumbers
export type TrackingNumbersQueryModel = TrackingNumbers
@Injectable()
export class TrackingNumbersRepository implements TrackingNumbersRepositoryPort {
  constructor(private readonly prismaService: PrismaService, private readonly mapper: TrackingNumbersMapper) {}

  async insert(entity: TrackingNumbersEntity): Promise<void> {
    try {
      const record = this.mapper.toPersistence(entity)
      await this.prismaService.trackingNumbers.create({ data: record })
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new AlreadyExistException()
      } else {
        throw e
      }
    }
  }

  async update(entity: TrackingNumbersEntity): Promise<void> {
    const record = this.mapper.toPersistence(entity)
    await this.prismaService.trackingNumbers.update({ where: { id: entity.id }, data: record })
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.trackingNumbers.delete({
      where: {
        id: id,
      },
    })
  }

  async findOne(id: string): Promise<TrackingNumbersEntity | null> {
    const record: TrackingNumbersQueryModel | null = await this.prismaService.trackingNumbers.findUnique({
      where: { id },
    })
    return record ? this.mapper.toDomain(record) : null
  }

  async findMany(offset: number, limit: number): Promise<TrackingNumbersEntity[]> {
    const records: TrackingNumbersQueryModel[] = await this.prismaService.trackingNumbers.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      skip: offset,
      take: limit,
    })

    return records.map((record) => {
      return this.mapper.toDomain(record)
    })
  }

  async getCount(): Promise<number> {
    return await this.prismaService.trackingNumbers.count()
  }
}
