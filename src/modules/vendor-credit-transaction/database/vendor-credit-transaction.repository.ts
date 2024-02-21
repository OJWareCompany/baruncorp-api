import { CreditTransactions } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../database/prisma.service'
import { VendorCreditTransactionMapper } from '../vendor-credit-transaction.mapper'
import { VendorCreditTransactionEntity } from '../domain/vendor-credit-transaction.entity'
import { VendorCreditTransactionRepositoryPort } from './vendor-credit-transaction.repository.port'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { VendorCreditTransactionNotFoundException } from '../domain/vendor-credit-transaction.error'

@Injectable()
export class VendorCreditTransactionRepository implements VendorCreditTransactionRepositoryPort {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly creditTransactionMapper: VendorCreditTransactionMapper,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  async find(vendorOrganizationId: string): Promise<VendorCreditTransactionEntity[]> {
    const records = await this.prismaService.vendorCreditTransactions.findMany({
      where: {
        vendorOrganizationId,
      },
    })

    return records.map(this.creditTransactionMapper.toDomain)
  }

  async insert(entity: VendorCreditTransactionEntity): Promise<void> {
    const record = this.creditTransactionMapper.toPersistence(entity)
    await this.prismaService.vendorCreditTransactions.create({ data: record })
    await entity.publishEvents(this.eventEmitter)
  }

  async update(entity: VendorCreditTransactionEntity): Promise<void> {
    const record = this.creditTransactionMapper.toPersistence(entity)
    await this.prismaService.vendorCreditTransactions.update({ where: { id: entity.id }, data: record })
    await entity.publishEvents(this.eventEmitter)
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.$executeRaw<CreditTransactions>`DELETE FROM vendor_credit_transactions WHERE id = ${id}`
  }

  async findOne(id: string): Promise<VendorCreditTransactionEntity | null> {
    const record = await this.prismaService.vendorCreditTransactions.findUnique({ where: { id } })
    return record ? this.creditTransactionMapper.toDomain(record) : null
  }
  async findOneOrThrow(id: string): Promise<VendorCreditTransactionEntity> {
    const record = await this.prismaService.vendorCreditTransactions.findUnique({ where: { id } })
    if (!record) throw new VendorCreditTransactionNotFoundException()
    return this.creditTransactionMapper.toDomain(record)
  }
}
