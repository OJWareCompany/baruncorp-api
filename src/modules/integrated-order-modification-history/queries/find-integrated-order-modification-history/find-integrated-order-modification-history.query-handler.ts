import { NotFoundException } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { IntegratedOrderModificationHistory } from '@prisma/client'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { PrismaService } from '../../../database/prisma.service'

export class FindIntegratedOrderModificationHistoryQuery {
  readonly integratedOrderModificationHistoryId: string
  constructor(props: FindIntegratedOrderModificationHistoryQuery) {
    initialize(this, props)
  }
}

@QueryHandler(FindIntegratedOrderModificationHistoryQuery)
export class FindIntegratedOrderModificationHistoryQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: FindIntegratedOrderModificationHistoryQuery): Promise<IntegratedOrderModificationHistory> {
    const result = await this.prismaService.integratedOrderModificationHistory.findFirstOrThrow({
      where: { jobId: query.integratedOrderModificationHistoryId },
    })
    if (!result) throw new NotFoundException()
    return result
  }
}
