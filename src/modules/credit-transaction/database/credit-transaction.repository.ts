import { CreditTransactions } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../database/prisma.service'
import { CreditTransactionMapper } from '../credit-transaction.mapper'
import { CreditTransactionEntity } from '../domain/credit-transaction.entity'
import { CreditTransactionRepositoryPort } from './credit-transaction.repository.port'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { CreditTransactionNotFoundException } from '../domain/credit-transaction.error'

@Injectable()
export class CreditTransactionRepository implements CreditTransactionRepositoryPort {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly creditTransactionMapper: CreditTransactionMapper,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  async find(clientOrganizationId: string): Promise<CreditTransactionEntity[]> {
    const records = await this.prismaService.creditTransactions.findMany({
      where: {
        clientOrganizationId,
      },
    })

    return records.map(this.creditTransactionMapper.toDomain)
  }

  async insert(entity: CreditTransactionEntity): Promise<void> {
    const record = this.creditTransactionMapper.toPersistence(entity)
    await this.prismaService.creditTransactions.create({ data: record })
    await entity.publishEvents(this.eventEmitter)
  }

  async update(entity: CreditTransactionEntity): Promise<void> {
    const record = this.creditTransactionMapper.toPersistence(entity)
    await this.prismaService.creditTransactions.update({ where: { id: entity.id }, data: record })
    await entity.publishEvents(this.eventEmitter)
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.$executeRaw<CreditTransactions>`DELETE FROM credit_transactions WHERE id = ${id}`
  }

  async findOne(id: string): Promise<CreditTransactionEntity | null> {
    const record = await this.prismaService.creditTransactions.findUnique({ where: { id } })
    return record ? this.creditTransactionMapper.toDomain(record) : null
  }
  async findOneOrThrow(id: string): Promise<CreditTransactionEntity> {
    const record = await this.prismaService.creditTransactions.findUnique({ where: { id } })
    if (!record) throw new CreditTransactionNotFoundException()
    return this.creditTransactionMapper.toDomain(record)
  }
}
