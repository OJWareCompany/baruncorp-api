import { NotFoundException } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Positions } from '@prisma/client'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { PrismaService } from '../../../database/prisma.service'

export class FindPositionUnRegisteredUsersQuery {
  readonly positionId: string
  constructor(props: FindPositionUnRegisteredUsersQuery) {
    initialize(this, props)
  }
}

@QueryHandler(FindPositionUnRegisteredUsersQuery)
export class FindPositionUnRegisteredUsersQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: FindPositionUnRegisteredUsersQuery): Promise<Positions> {
    const result = await this.prismaService.positions.findUnique({ where: { id: query.positionId } })
    if (!result) throw new NotFoundException()
    return result
  }
}
