import { NotFoundException } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Positions } from '@prisma/client'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { PrismaService } from '../../../database/prisma.service'

export class FindPositionQuery {
  readonly positionId: string
  constructor(props: FindPositionQuery) {
    initialize(this, props)
  }
}

@QueryHandler(FindPositionQuery)
export class FindPositionQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: FindPositionQuery): Promise<Positions> {
    const result = await this.prismaService.positions.findUnique({ where: { id: query.positionId } })
    if (!result) throw new NotFoundException()
    return result
  }
}
