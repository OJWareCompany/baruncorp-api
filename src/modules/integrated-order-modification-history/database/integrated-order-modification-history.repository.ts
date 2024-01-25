import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../database/prisma.service'
import { IntegratedOrderModificationHistoryMapper } from '../integrated-order-modification-history.mapper'
import { IntegratedOrderModificationHistoryRepositoryPort } from './integrated-order-modification-history.repository.port'
import { Paginated } from '../../../libs/ddd/repository.port'
import { IntegratedOrderModificationHistoryEntity } from '../domain/integrated-order-modification-history.entity'

@Injectable()
export class IntegratedOrderModificationHistoryRepository implements IntegratedOrderModificationHistoryRepositoryPort {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly integratedOrderModificationHistoryMapper: IntegratedOrderModificationHistoryMapper,
  ) {}
  find(): Promise<Paginated<IntegratedOrderModificationHistoryEntity>> {
    throw new Error('Method not implemented.')
  }

  async insert(entity: IntegratedOrderModificationHistoryEntity): Promise<void> {
    const record = this.integratedOrderModificationHistoryMapper.toPersistence(entity)
    await this.prismaService.integratedOrderModificationHistory.create({ data: record })
  }
}
