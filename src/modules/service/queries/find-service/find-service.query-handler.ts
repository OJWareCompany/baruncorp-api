import { Service, Tasks } from '@prisma/client'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { PrismaService } from '../../../database/prisma.service'
import { ServiceNotFoundException } from '../../domain/service.error'

export class FindServiceQuery {
  readonly serviceId: string
  constructor(props: FindServiceQuery) {
    initialize(this, props)
  }
}

@QueryHandler(FindServiceQuery)
export class FindServiceQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: FindServiceQuery): Promise<Service & { tasks: Tasks[] }> {
    const result = await this.prismaService.service.findUnique({
      where: { id: query.serviceId },
      include: { tasks: true },
    })
    if (!result) throw new ServiceNotFoundException()
    return result
  }
}
