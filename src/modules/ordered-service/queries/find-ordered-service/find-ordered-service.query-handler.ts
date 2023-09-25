import { NotFoundException } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { AssignedTasks, OrderedServices, Service, Tasks } from '@prisma/client'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { ServiceNotFoundException } from '../../../service/domain/service.error'
import { PrismaService } from '../../../database/prisma.service'

export class FindOrderedServiceQuery {
  readonly orderedServiceId: string
  constructor(props: FindOrderedServiceQuery) {
    initialize(this, props)
  }
}

@QueryHandler(FindOrderedServiceQuery)
export class FindOrderedServiceQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(
    query: FindOrderedServiceQuery,
  ): Promise<OrderedServices & { assignedTasks: AssignedTasks[]; service: Service & { tasks: Tasks[] } }> {
    const result = await this.prismaService.orderedServices.findUnique({
      where: { id: query.orderedServiceId },
      include: { assignedTasks: true },
    })

    if (!result) throw new NotFoundException()

    // TODO: 위의 assignedTasks가 tasks를 조인해서 task name을 가져오고싶은데, 타입명시를 못하겠음.
    const service = await this.prismaService.service.findUnique({
      where: { id: result.serviceId },
      include: { tasks: true },
    })

    if (!service) throw new ServiceNotFoundException()

    return {
      ...result,
      service,
    }
  }
}
