import { NotFoundException } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { AssignedTasks, OrderedServices, Users } from '@prisma/client'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { PrismaService } from '../../../database/prisma.service'

export class FindAssignedTaskQuery {
  readonly assignedTaskId: string
  constructor(props: FindAssignedTaskQuery) {
    initialize(this, props)
  }
}

@QueryHandler(FindAssignedTaskQuery)
export class FindAssignedTaskQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(
    query: FindAssignedTaskQuery,
  ): Promise<AssignedTasks & { user: Users | null; orderedService: OrderedServices }> {
    const result = await this.prismaService.assignedTasks.findUnique({
      where: { id: query.assignedTaskId },
      include: { user: true, orderedService: true },
    })
    if (!result) throw new NotFoundException()
    return result
  }
}
