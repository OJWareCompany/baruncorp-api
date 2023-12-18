import { Injectable } from '@nestjs/common'
import { Positions } from '@prisma/client'
import { PrismaService } from '../../database/prisma.service'
import { PositionMapper } from '../position.mapper'
import { PositionRepositoryPort } from './position.repository.port'
import { Paginated } from '../../../libs/ddd/repository.port'
import { PositionEntity } from '../domain/position.entity'

@Injectable()
export class PositionRepository implements PositionRepositoryPort {
  constructor(private readonly prismaService: PrismaService, private readonly positionMapper: PositionMapper) {}
  find(): Promise<Paginated<PositionEntity>> {
    throw new Error('Method not implemented.')
  }

  async insert(entity: PositionEntity): Promise<void> {
    const record = this.positionMapper.toPersistence(entity)
    await this.prismaService.positions.create({ data: record })
  }

  async update(entity: PositionEntity): Promise<void> {
    const record = this.positionMapper.toPersistence(entity)
    await this.prismaService.positions.update({ where: { id: entity.id }, data: record })
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.$executeRaw<Positions>`DELETE FROM positions WHERE id = ${id}`
  }

  async findOne(id: string): Promise<PositionEntity | null> {
    const record = await this.prismaService.positions.findUnique({ where: { id } })
    return record ? this.positionMapper.toDomain(record) : null
  }
}
