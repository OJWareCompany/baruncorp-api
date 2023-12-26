import { Injectable } from '@nestjs/common'
import { ExpensePricings } from '@prisma/client'
import { PrismaService } from '../../database/prisma.service'
import { ExpensePricingMapper } from '../expense-pricing.mapper'
import { ExpensePricingRepositoryPort } from './expense-pricing.repository.port'
import { Paginated } from '../../../libs/ddd/repository.port'
import { ExpensePricingEntity } from '../domain/expense-pricing.entity'
import { ExpensePricingNotFoundException } from '../domain/expense-pricing.error'
import { EventEmitter2 } from '@nestjs/event-emitter'

@Injectable()
export class ExpensePricingRepository implements ExpensePricingRepositoryPort {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly expensePricingMapper: ExpensePricingMapper,
    protected readonly eventEmitter: EventEmitter2,
  ) {}

  find(): Promise<Paginated<ExpensePricingEntity>> {
    throw new Error('Method not implemented.')
  }
  async insert(entity: ExpensePricingEntity): Promise<void> {
    const entities = Array.isArray(entity) ? entity : [entity]
    const records = entities.map(this.expensePricingMapper.toPersistence)
    await this.prismaService.expensePricings.createMany({ data: records })
    for (const entity of entities) {
      await entity.publishEvents(this.eventEmitter)
    }
  }

  async update(entity: ExpensePricingEntity): Promise<void> {
    const entities = Array.isArray(entity) ? entity : [entity]
    const records = entities.map(this.expensePricingMapper.toPersistence)
    await Promise.all(
      records.map(async (record) => {
        await this.prismaService.expensePricings.updateMany({
          where: {
            organizationId: record.organizationId,
            taskId: record.taskId,
          },
          data: record,
        })
      }),
    )

    for (const entity of entities) {
      await entity.publishEvents(this.eventEmitter)
    }
  }

  async delete(organizationId: string, taskId: string): Promise<void> {
    await this.prismaService.$executeRaw<ExpensePricings>`DELETE FROM expense_pricings WHERE
    organization_id = ${organizationId}
    AND task_id = ${taskId}
    `
  }

  async findOne(organizationId: string, taskId: string): Promise<ExpensePricingEntity | null> {
    const record = await this.prismaService.expensePricings.findFirst({ where: { organizationId, taskId } })
    return record ? this.expensePricingMapper.toDomain(record) : null
  }
  async findOneOrThrow(organizationId: string, taskId: string): Promise<ExpensePricingEntity> {
    const record = await this.prismaService.expensePricings.findFirst({ where: { organizationId, taskId } })
    if (!record) throw new ExpensePricingNotFoundException()
    return this.expensePricingMapper.toDomain(record)
  }
}
