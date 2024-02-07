import { Injectable } from '@nestjs/common'
import { Couriers, Prisma } from '@prisma/client'
import { PrismaService } from '../../database/prisma.service'
import { CouriersMapper } from '../couriers.mapper'
import { CouriersEntity } from '../domain/couriers.entity'
import { CouriersRepositoryPort } from './couriers.repository.port'
import { UniqueCouriersException } from '@modules/couriers/domain/couriers.error'

export type CouriersModel = Couriers
export type CouriersQueryModel = Couriers
@Injectable()
export class CouriersRepository implements CouriersRepositoryPort {
  constructor(private readonly prismaService: PrismaService, private readonly mapper: CouriersMapper) {}

  async insert(entity: CouriersEntity): Promise<void> {
    try {
      const record = this.mapper.toPersistence(entity)
      await this.prismaService.couriers.create({ data: record })
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new UniqueCouriersException()
      } else {
        throw e
      }
    }
  }

  async update(entity: CouriersEntity): Promise<void> {
    try {
      const record = this.mapper.toPersistence(entity)
      await this.prismaService.couriers.update({ where: { id: entity.id }, data: record })
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new UniqueCouriersException()
      } else {
        throw e
      }
    }
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.couriers.delete({
      where: {
        id: id,
      },
    })
  }

  async findOne(id: string): Promise<CouriersEntity | null> {
    const record: CouriersQueryModel | null = await this.prismaService.couriers.findUnique({
      where: { id },
    })
    return record ? this.mapper.toDomain(record) : null
  }

  async findMany(offset: number, limit: number): Promise<CouriersEntity[]> {
    const records: CouriersQueryModel[] = await this.prismaService.couriers.findMany({
      skip: offset,
      take: limit,
      orderBy: {
        name: 'asc',
      },
    })

    return records.map((record) => {
      return this.mapper.toDomain(record)
    })
  }

  async getCount(): Promise<number> {
    return await this.prismaService.couriers.count()
  }
}
