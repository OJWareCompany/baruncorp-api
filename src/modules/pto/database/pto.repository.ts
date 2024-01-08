import { Injectable, NotFoundException } from '@nestjs/common'
import { PtoAvailableValues, Ptos } from '@prisma/client'
import { PrismaService } from '../../database/prisma.service'
import { PtoMapper } from '../pto.mapper'
import { PtoEntity } from '../domain/pto.entity'
import { PtoRepositoryPort } from './pto.repository.port'
import { Paginated } from '@src/libs/ddd/repository.port'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { UniqueConstraintException } from '../domain/pto.error'

export type PtoModel = Ptos
export type PtoQueryModel = Ptos & {
  availableValues: PtoAvailableValues[]
}
@Injectable()
export class PtoRepository implements PtoRepositoryPort {
  private ptoQueryIncludeInput = {
    availableValues: true,
  }

  constructor(private readonly prismaService: PrismaService, private readonly ptoMapper: PtoMapper) {}

  async insert(entity: PtoEntity): Promise<void> {
    try {
      const record = this.ptoMapper.toPersistence(entity)
      await this.prismaService.ptos.create({ data: record })
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new UniqueConstraintException('name')
        }
      }
      throw error
    }
  }

  async update(entity: PtoEntity): Promise<void> {
    try {
      const record = this.ptoMapper.toPersistence(entity)
      await this.prismaService.ptos.update({ where: { id: entity.id }, data: record })
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new UniqueConstraintException('name')
        }
      }
      throw error
    }
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.$executeRaw<Ptos>`DELETE FROM ptos WHERE id = ${id}`
  }

  async findOne(id: string): Promise<PtoEntity | null> {
    const record: PtoQueryModel | null = await this.prismaService.ptos.findUnique({
      where: { id },
      include: this.ptoQueryIncludeInput,
    })
    return record ? this.ptoMapper.toDomain(record) : null
  }

  //: Promise<Paginated<PtoEntity>>
  async findMany(offset: number, limit: number): Promise<PtoEntity[]> {
    const records: PtoQueryModel[] = await this.prismaService.ptos.findMany({
      skip: offset,
      take: limit,
      include: this.ptoQueryIncludeInput,
      orderBy: {
        name: 'asc',
      },
    })

    return records.map((record) => {
      return this.ptoMapper.toDomain(record)
    })
  }

  async getCount(): Promise<number> {
    return await this.prismaService.ptos.count()
  }
}
