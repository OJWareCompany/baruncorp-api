import { Injectable } from '@nestjs/common'
import { Paginated } from '../../../libs/ddd/repository.port'
import { PrismaService } from '../../database/prisma.service'
import { VendorPaymentMapper } from '../vendor-payment.mapper'
import { VendorPaymentEntity } from '../domain/vendor-payment.entity'
import { VendorPaymentRepositoryPort } from './vendor-payment.repository.port'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { VendorPayments } from '@prisma/client'

@Injectable()
export class VendorPaymentRepository implements VendorPaymentRepositoryPort {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly paymentMapper: VendorPaymentMapper,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  find(): Promise<Paginated<VendorPaymentEntity>> {
    throw new Error('Method not implemented.')
  }

  async insert(entity: VendorPaymentEntity): Promise<void> {
    const record = this.paymentMapper.toPersistence(entity)
    await this.prismaService.vendorPayments.create({ data: record })
    await entity.publishEvents(this.eventEmitter)
  }

  async update(entity: VendorPaymentEntity): Promise<void> {
    const record = this.paymentMapper.toPersistence(entity)
    await this.prismaService.vendorPayments.update({ where: { id: entity.id }, data: record })
    await entity.publishEvents(this.eventEmitter)
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.$executeRaw<VendorPayments>`DELETE FROM payments WHERE id = ${id}`
  }

  async findOne(id: string): Promise<VendorPaymentEntity | null> {
    const record = await this.prismaService.vendorPayments.findUnique({ where: { id } })
    return record ? this.paymentMapper.toDomain(record) : null
  }
}
