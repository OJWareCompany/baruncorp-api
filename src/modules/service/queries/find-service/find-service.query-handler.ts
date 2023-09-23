import { Service } from '@prisma/client'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { PrismaService } from '../../../database/prisma.service'
import { ServiceNotFoundException } from '../../domain/service/service.error'

export class FindServiceQuery {
  readonly serviceId: string
  constructor(props: FindServiceQuery) {
    initialize(this, props)
  }
}

@QueryHandler(FindServiceQuery)
export class FindServiceQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: FindServiceQuery): Promise<Service> {
    const result = await this.prismaService.service.findUnique({ where: { id: query.serviceId } })
    if (!result) throw new ServiceNotFoundException()
    return result
  }
}
