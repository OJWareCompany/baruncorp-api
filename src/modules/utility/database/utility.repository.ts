import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { UtilitySnapshots, Utilities, Prisma } from '@prisma/client'
import { PrismaService } from '../../database/prisma.service'
import { UtilityRepositoryPort } from './utility.repository.port'
import { UtilityMapper } from '../utility.mapper'
import { UtilitySnapshotEntity } from '../domain/utility-snapshot.entity'

export type UtilityModel = Utilities
export type UtilityQueryModel = Utilities

export type UtilitySnapshotModel = UtilitySnapshots
export type UtilitySnapshotQueryModel = UtilitySnapshots

@Injectable()
export class UtilityRepository implements UtilityRepositoryPort {
  constructor(private readonly prismaService: PrismaService, private readonly mapper: UtilityMapper) {}

  async insert(id: string): Promise<void> {
    const record: UtilityModel = {
      id: id,
    }
    await this.prismaService.utilities.create({ data: record })
  }

  async insertSnapshot(entity: UtilitySnapshotEntity): Promise<void> {
    const record = this.mapper.toPersistence(entity)
    await this.prismaService.utilitySnapshots.create({
      data: record,
    })
  }
}
