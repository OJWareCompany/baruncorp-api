import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Users } from '@prisma/client'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { PrismaService } from '../../../database/prisma.service'
import { PositionNotFoundException } from '../../domain/position.error'

export class FindPositionUnRegisteredUsersQuery {
  readonly positionId: string
  constructor(props: FindPositionUnRegisteredUsersQuery) {
    initialize(this, props)
  }
}

@QueryHandler(FindPositionUnRegisteredUsersQuery)
export class FindPositionUnRegisteredUsersQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: FindPositionUnRegisteredUsersQuery): Promise<Users[]> {
    const position = await this.prismaService.positions.findUnique({ where: { id: query.positionId } })
    if (!position) throw new PositionNotFoundException()
    const positionWorkers = await this.prismaService.userPosition.findMany({ where: { positionId: query.positionId } })
    const users = await this.prismaService.users.findMany({
      where: {
        id: { notIn: positionWorkers.map((worker) => worker.userId) },
      },
    })
    return users
  }
}
