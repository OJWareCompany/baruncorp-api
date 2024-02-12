import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { UtilitySnapshots, Utilities, Prisma } from '@prisma/client'
import { PrismaService } from '../../database/prisma.service'
import { UtilityRepositoryPort } from './utility.repository.port'
import { UtilityMapper } from '../utility.mapper'
import { UtilitySnapshotEntity } from '../domain/utility-snapshot.entity'
import { UtilityEntity } from '@modules/utility/domain/utility.entity'
import { UtilityNotFoundException } from '@modules/utility/domain/utilty.error'
import { PtoTargetUser } from '@modules/pto/domain/value-objects/target.user.vo'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { TargetUserNotFoundException } from '@modules/pto/domain/pto.error'

export type UtilityModel = Utilities
export type UtilityQueryModel = Utilities

export type UtilitySnapshotModel = UtilitySnapshots
export type UtilitySnapshotQueryModel = UtilitySnapshots

@Injectable()
export class UtilityRepository implements UtilityRepositoryPort {
  constructor(private readonly prismaService: PrismaService, private readonly mapper: UtilityMapper) {}

  async insert(entity: UtilityEntity): Promise<void> {
    const record: UtilityModel = this.mapper.toPersistence(entity)
    await this.prismaService.utilities.create({ data: record })
  }

  async insertSnapshot(entity: UtilitySnapshotEntity): Promise<void> {
    const record = this.mapper.toSnapshotPersistence(entity)
    await this.prismaService.utilitySnapshots.create({
      data: record,
    })
  }

  async update(entity: UtilityEntity): Promise<void> {
    const record = this.mapper.toPersistence(entity)
    await this.prismaService.utilities.update({ where: { id: entity.id }, data: record })
  }

  async findOne(id: string): Promise<UtilityEntity | null> {
    try {
      const record = await this.prismaService.utilities.findUniqueOrThrow({
        where: { id: id },
      })

      return this.mapper.toDomain(record)
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new UtilityNotFoundException()
      } else {
        throw error
      }
    }
  }
}
