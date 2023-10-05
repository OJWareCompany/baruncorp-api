import { Injectable } from '@nestjs/common'
import { Payments } from '@prisma/client'
import { Paginated } from '../../../libs/ddd/repository.port'
import { PrismaService } from '../../database/prisma.service'
import { PaymentMapper } from '../payment.mapper'
import { PaymentEntity } from '../domain/payment.entity'
import { PaymentRepositoryPort } from './payment.repository.port'
import { EventEmitter2 } from '@nestjs/event-emitter'

@Injectable()
export class PaymentRepository implements PaymentRepositoryPort {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly paymentMapper: PaymentMapper,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  find(): Promise<Paginated<PaymentEntity>> {
    throw new Error('Method not implemented.')
  }

  async insert(entity: PaymentEntity): Promise<void> {
    const record = this.paymentMapper.toPersistence(entity)
    await this.prismaService.payments.create({ data: record })
    await entity.publishEvents(this.eventEmitter)
  }

  async update(entity: PaymentEntity): Promise<void> {
    const record = this.paymentMapper.toPersistence(entity)
    await this.prismaService.payments.update({ where: { id: entity.id }, data: record })
    await entity.publishEvents(this.eventEmitter)
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.$executeRaw<Payments>`DELETE FROM payments WHERE id = ${id}`
  }

  async findOne(id: string): Promise<PaymentEntity | null> {
    const record = await this.prismaService.payments.findUnique({ where: { id } })
    return record ? this.paymentMapper.toDomain(record) : null
  }
}
