import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { AssignedTasks, OrderedServices, Prisma, Service, Tasks } from '@prisma/client'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { PrismaService } from '../../../database/prisma.service'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { OrderedServiceStatusEnum } from '../../domain/ordered-service.type'
import { MountingTypeEnum, ProjectPropertyTypeEnum } from '../../../project/domain/project.type'

export class FindOrderedServiceQuery extends PaginatedQueryBase {
  readonly serviceName?: string | null
  readonly organizationName?: string | null
  readonly jobName?: string | null
  readonly orderedServiceStatus?: OrderedServiceStatusEnum | null
  readonly isRevision?: boolean | null
  readonly projectPropertyType?: ProjectPropertyTypeEnum | null
  readonly mountingType?: MountingTypeEnum | null
  constructor(props: PaginatedParams<FindOrderedServiceQuery>) {
    super(props)
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

  async execute(query: FindOrderedServiceQuery): Promise<Paginated<FindOrderedServiceQueryReturnType>> {
    const condition: Prisma.OrderedServicesWhereInput = {
      ...(query.serviceName && { serviceName: { contains: query.serviceName } }),
      ...(query.organizationName && { organizationName: { contains: query.organizationName } }),
      ...(query.jobName && { jobName: { contains: query.jobName } }),
      ...(query.orderedServiceStatus && { status: query.orderedServiceStatus }),
      ...(query.isRevision && { isRevision: query.isRevision }),
      ...(query.projectPropertyType && { projectPropertyType: query.projectPropertyType }),
      ...(query.mountingType && { mountingType: query.mountingType }),
    }

    const result: FindOrderedServiceQueryReturnType[] | null = await this.prismaService.orderedServices.findMany({
      where: condition,
      include: { assignedTasks: true, service: { include: { tasks: true } } },
      orderBy: { orderedAt: 'desc' },
      take: query.limit,
      skip: query.offset,
    })

    const totalCount = await this.prismaService.orderedServices.count({ where: condition })

    return new Paginated<FindOrderedServiceQueryReturnType>({
      pageSize: query.limit,
      page: query.page,
      totalCount: totalCount,
      items: result,
    })
  }
}
