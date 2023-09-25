import { Injectable } from '@nestjs/common'
import { AssignedTasks, OrderedServices, Prisma } from '@prisma/client'
import { Mapper } from '../../libs/ddd/mapper.interface'
import { OrderedServiceEntity } from './domain/ordered-service.entity'
import { OrderedServiceResponse } from './dtos/ordered-service.response.dto'
import { OrderedServiceStatus } from './domain/ordered-service.type'

@Injectable()
export class OrderedServiceMapper implements Mapper<OrderedServiceEntity, OrderedServices, OrderedServiceResponse> {
  toPersistence(entity: OrderedServiceEntity): OrderedServices {
    const props = entity.getProps()
    return {
      id: props.id,
      serviceId: props.serviceId,
      jobId: props.jobId,
      price: props.price ? new Prisma.Decimal(props.price) : null,
      priceOverride: props.priceOverride ? new Prisma.Decimal(props.priceOverride) : null,
      status: props.status,
      orderedAt: props.orderedAt,
      doneAt: props.doneAt,
    }
  }

  toDomain(record: OrderedServices & { assignedTasks: AssignedTasks[] }): OrderedServiceEntity {
    const entity = new OrderedServiceEntity({
      id: record.id,
      props: {
        serviceId: record.serviceId,
        jobId: record.jobId,
        price: Number(record.price),
        priceOverride: Number(record.priceOverride),
        orderedAt: record.orderedAt,
        doneAt: record.doneAt,
        status: record.status as OrderedServiceStatus,
        assignedTasks: record.assignedTasks,
      },
    })
    return entity
  }

  toResponse(entity: OrderedServiceEntity): OrderedServiceResponse {
    throw new Error('Method not implemented.')
  }
}
