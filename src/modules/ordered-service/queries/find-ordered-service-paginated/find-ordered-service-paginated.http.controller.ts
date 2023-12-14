import { Controller, Get, Param, Query } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { OrderedServiceResponseDto } from '../../dtos/ordered-service.response.dto'
import { OrderedServiceStatusEnum } from '../../domain/ordered-service.type'
import { FindOrderedServicePaginatedRequestDto } from './find-ordered-service-paginated.request.dto'
import {
  FindOrderedServiceQuery,
  FindOrderedServiceQueryReturnType as FindOrderedServicePaginatedQueryReturnType,
} from './find-ordered-service-paginated.query-handler'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'

@Controller('ordered-services')
export class FindOrderedServicePaginatedHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('')
  async get(
    @Param() request: FindOrderedServicePaginatedRequestDto,
    @Query() queryParams: PaginatedQueryRequestDto,
  ): Promise<OrderedServiceResponseDto> {
    const command = new FindOrderedServiceQuery({
      ...queryParams,
      ...request,
    })

    const result: FindOrderedServicePaginatedQueryReturnType = await this.queryBus.execute(command)
    return new OrderedServiceResponseDto({
      id: result.id,
      serviceName: result.serviceName,
      organizationName: result.organizationName,
      jobName: result.job_name,
      projectPropertyType: result.projectPropertyType,
      mountingType: result.mountingType,
      isRevision: result.isRevision,
      serviceId: result.serviceId,
      price: result.price ? Number(result.price) : null,
      priceOrverride: result.priceOverride ? Number(result.priceOverride) : null,
      jobId: result.jobId,
      status: result.status as OrderedServiceStatusEnum,
      orderedAt: result.orderedAt.toISOString(),
      doneAt: result.doneAt ? result.doneAt.toISOString() : null,
      assignedTasks: result.assignedTasks.map((task) => {
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
  }
}
