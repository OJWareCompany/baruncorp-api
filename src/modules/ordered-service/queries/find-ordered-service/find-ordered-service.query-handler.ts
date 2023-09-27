import { NotFoundException } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { AssignedTasks, OrderedServices, Service, Tasks } from '@prisma/client'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { PrismaService } from '../../../database/prisma.service'

export class FindOrderedServiceQuery {
  readonly orderedServiceId: string
  constructor(props: FindOrderedServiceQuery) {
    initialize(this, props)
  }
}

export type FindOrderedServiceQueryReturnType = OrderedServices & {
  assignedTasks: AssignedTasks[]
  service: Service & { tasks: Tasks[] }
}

@QueryHandler(FindOrderedServiceQuery)
export class FindOrderedServiceQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: FindOrderedServiceQuery): Promise<FindOrderedServiceQueryReturnType> {
    const result: FindOrderedServiceQueryReturnType | null = await this.prismaService.orderedServices.findUnique({
      where: { id: query.orderedServiceId },
      include: { assignedTasks: true, service: { include: { tasks: true } } },
    })

    if (!result) throw new NotFoundException()

    return result
  }
}
