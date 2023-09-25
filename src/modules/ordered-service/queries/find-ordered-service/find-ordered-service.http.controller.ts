import { Controller, Get, Param } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { AssignedTasks, OrderedServices, Service, Tasks } from '@prisma/client'
import { OrderedServiceResponseDto } from '../../dtos/ordered-service.response.dto'
import { OrderedServiceStatusEnum } from '../../domain/ordered-service.type'
import { FindOrderedServiceRequestDto } from './find-ordered-service.request.dto'
import { FindOrderedServiceQuery } from './find-ordered-service.query-handler'

@Controller('ordered-services')
export class FindOrderedServiceHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':orderedServiceId')
  async get(@Param() request: FindOrderedServiceRequestDto): Promise<OrderedServiceResponseDto> {
    const command = new FindOrderedServiceQuery(request)

    const result: OrderedServices & {
      assignedTasks: AssignedTasks[]
      service: Service & { tasks: Tasks[] }
    } = await this.queryBus.execute(command)

    return new OrderedServiceResponseDto({
      id: result.id,
      serviceId: result.serviceId,
      price: Number(result.price),
      jobId: result.jobId,
      status: result.status as OrderedServiceStatusEnum,
      orderedAt: result.orderedAt.toISOString(),
      doneAt: result.doneAt ? result.doneAt.toISOString() : null,
      assignedTasks: result.assignedTasks.map((task) => {
        return {
          id: task.id,
          taskName: result.service.tasks.find((t) => t.id === task.id)?.name || 'unknown',
          status: task.status,
          assigneeId: task.assigneeId,
          startedAt: task.startedAt ? task.startedAt.toISOString() : null,
          doneAt: task.doneAt ? task.doneAt.toISOString() : null,
        }
      }),
    })
  }
}
