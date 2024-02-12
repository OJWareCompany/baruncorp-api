import { Injectable } from '@nestjs/common'
import { UserSchedules } from '@prisma/client'
import { PrismaService } from '../../database/prisma.service'
import { ScheduleEntity } from '../domain/schedule.entity'
import { ScheduleRepositoryPort } from './schedule.repository.port'
import { ScheduleMapper } from '../schedule.mapper'

export type ScheduleModel = UserSchedules
export type ScheduleQueryModel = UserSchedules

@Injectable()
export class ScheduleRepository implements ScheduleRepositoryPort {
  constructor(private readonly prismaService: PrismaService, private readonly mapper: ScheduleMapper) {}

  async upsert(entity: ScheduleEntity): Promise<void> {
    const record = this.mapper.toPersistence(entity)
    await this.prismaService.userSchedules.upsert({
      where: { id: entity.id },
      update: {
        id: record.id,
        schedules: record.schedules!,
      },
      create: {
        id: record.id,
        schedules: record.schedules!,
      },
    })
  }
}
