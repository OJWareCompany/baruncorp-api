import { NotFoundException } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { PositionTasks, Positions, UserPosition } from '@prisma/client'
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

  async execute(query: FindPositionQuery): Promise<{
    position: Positions
    tasks: PositionTasks[]
    workers: UserPosition[]
  }> {
    const position = await this.prismaService.positions.findUnique({ where: { id: query.positionId } })
    if (!position) throw new NotFoundException()

    const tasks = await this.prismaService.positionTasks.findMany({
      where: {
        positionId: query.positionId,
      },
    })

    const workers = await this.prismaService.userPosition.findMany({
      where: {
        positionId: query.positionId,
      },
    })

    return {
      position,
      tasks,
      workers,
    }
  }
}
