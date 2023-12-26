import { EventEmitter2 } from '@nestjs/event-emitter'
import { PrismaService } from '../../database/prisma.service'
import { AssigningTaskAlertsMapper } from '../assigning-task-alert.mapper'
import { AssigningTaskAlertEntity } from '../domain/assigning-task-alert.entity'
import { AssigningTaskAlertRepositoryPort } from './assigning-task-alert.repository.port'
import { AssigningTaskAlertNotFoundException } from '../domain/assigning-task-alert.error'
import { Injectable } from '@nestjs/common'

@Injectable()
export class AssigningTaskAlertRepository implements AssigningTaskAlertRepositoryPort {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mapper: AssigningTaskAlertsMapper,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(entity: AssigningTaskAlertEntity): Promise<void> {
    const record = this.mapper.toPersistence(entity)
    await this.prismaService.assigningTaskAlerts.create({ data: record })
    await entity.publishEvents(this.eventEmitter)
  }

  async findOne(id: string): Promise<AssigningTaskAlertEntity | null> {
    const record = await this.prismaService.assigningTaskAlerts.findFirst({ where: { id: id } })
    return record ? this.mapper.toDomain(record) : null
  }

  async findOneOrThrow(id: string): Promise<AssigningTaskAlertEntity> {
    const result = await this.findOne(id)
    if (!result) throw new AssigningTaskAlertNotFoundException()
    return result
  }

  async update(entity: AssigningTaskAlertEntity): Promise<void> {
    const record = this.mapper.toPersistence(entity)
    await this.prismaService.assigningTaskAlerts.update({ where: { id: entity.id }, data: record })
    await entity.publishEvents(this.eventEmitter)
  }
}
