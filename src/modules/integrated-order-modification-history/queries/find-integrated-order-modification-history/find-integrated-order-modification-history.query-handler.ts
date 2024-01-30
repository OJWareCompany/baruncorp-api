import { NotFoundException } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { IntegratedOrderModificationHistory } from '@prisma/client'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { PrismaService } from '../../../database/prisma.service'

export class FindIntegratedOrderModificationHistoryQuery {
  readonly attribute: string
  readonly entityId: string
  readonly jobId: string
  readonly modifiedAt: Date

  constructor(props: FindIntegratedOrderModificationHistoryQuery) {
    initialize(this, props)
  }
}

@QueryHandler(FindIntegratedOrderModificationHistoryQuery)
export class FindIntegratedOrderModificationHistoryQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: FindIntegratedOrderModificationHistoryQuery): Promise<IntegratedOrderModificationHistory> {
    const result = await this.prismaService.integratedOrderModificationHistory.findUnique({
      where: {
        jobId_modifiedAt_entityId_attribute: {
          attribute: query.attribute,
          entityId: query.entityId,
          jobId: query.jobId,
          modifiedAt: query.modifiedAt,
        },
      },
    })
    if (!result) throw new NotFoundException()
    return result
  }
}
