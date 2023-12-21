import { Controller, Get, Param } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { OrderedServiceResponseDto } from '../../dtos/ordered-service.response.dto'
import { OrderedServiceStatusEnum } from '../../domain/ordered-service.type'
import { FindOrderedServiceRequestDto } from './find-ordered-service.request.dto'
import { FindOrderedServiceQuery, FindOrderedServiceQueryReturnType } from './find-ordered-service.query-handler'

@Controller('ordered-services')
export class FindOrderedServiceHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':orderedServiceId')
  async get(@Param() request: FindOrderedServiceRequestDto): Promise<OrderedServiceResponseDto> {
    const command = new FindOrderedServiceQuery(request)

    const result: FindOrderedServiceQueryReturnType = await this.queryBus.execute(command)
    return new OrderedServiceResponseDto({
      id: result.id,
      serviceName: result.serviceName,
      organizationName: result.organizationName,
      jobName: result.jobName,
      projectPropertyType: result.projectPropertyType,
      mountingType: result.mountingType,
      isRevision: result.isRevision,
      serviceId: result.serviceId,
      price: result.price ? Number(result.price) : null,
      priceOverride: result.priceOverride ? Number(result.priceOverride) : null,
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
