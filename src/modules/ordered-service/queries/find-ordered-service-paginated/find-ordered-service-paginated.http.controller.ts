import { QueryBus } from '@nestjs/cqrs'
import { Controller, Get, Param, Query } from '@nestjs/common'
import { FindOrderedServicePaginatedRequestDto } from './find-ordered-service-paginated.request.dto'
import { FindOrderedServicePaginatedQuery } from './find-ordered-service-paginated.query-handler'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { OrderedServicePaginatedResponseDto } from '../../dtos/ordered-service.paginated.response.dto'
import { FindOrderedServiceQueryReturnType } from '../find-ordered-service/find-ordered-service.query-handler'
import { OrderedServiceResponseDto } from '../../dtos/ordered-service.response.dto'
import { OrderedServiceStatusEnum } from '../../domain/ordered-service.type'

@Controller('ordered-services')
export class FindOrderedServicePaginatedHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('')
  async get(
    @Param() request: FindOrderedServicePaginatedRequestDto,
    @Query() queryParams: PaginatedQueryRequestDto,
  ): Promise<OrderedServicePaginatedResponseDto> {
    const command = new FindOrderedServicePaginatedQuery({
      ...queryParams,
      ...request,
    })

    const result: Paginated<FindOrderedServiceQueryReturnType> = await this.queryBus.execute(command)

    return new Paginated({
      page: result.page,
      pageSize: result.pageSize,
      totalCount: result.totalCount,
      items: result.items.map((item) => {
        return new OrderedServiceResponseDto({
          id: item.id,
          serviceName: item.serviceName,
          organizationName: item.organizationName,
          jobName: item.job_name,
          projectPropertyType: item.projectPropertyType,
          mountingType: item.mountingType,
          isRevision: item.isRevision,
          serviceId: item.serviceId,
          price: item.price ? Number(item.price) : null,
          priceOrverride: item.priceOverride ? Number(item.priceOverride) : null,
          jobId: item.jobId,
          status: item.status as OrderedServiceStatusEnum,
          orderedAt: item.orderedAt.toISOString(),
          doneAt: item.doneAt ? item.doneAt.toISOString() : null,
          assignedTasks: item.assignedTasks.map((task) => {
            return {
              id: task.id,
              taskName: task.taskName,
              status: task.status,
              assigneeId: task.assigneeId,
              startedAt: task.startedAt ? task.startedAt.toISOString() : null,
              doneAt: task.doneAt ? task.doneAt.toISOString() : null,
            }
          }),
        })
      }),
    })
  }
}
