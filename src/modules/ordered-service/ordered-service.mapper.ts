import { Injectable } from '@nestjs/common'
import { AssignedTasks, OrderedServices, Prisma } from '@prisma/client'
import { Mapper } from '../../libs/ddd/mapper.interface'
import { OrderedServiceEntity } from './domain/ordered-service.entity'
import { OrderedServiceResponseDto } from './dtos/ordered-service.response.dto'
import {
  OrderedServiceSizeForRevision,
  OrderedServiceSizeForRevisionEnum,
  OrderedServiceStatus,
} from './domain/ordered-service.type'

@Injectable()
export class OrderedServiceMapper implements Mapper<OrderedServiceEntity, OrderedServices, OrderedServiceResponseDto> {
  toPersistence(entity: OrderedServiceEntity): OrderedServices {
    const props = entity.getProps()
    return {
      id: props.id,
      serviceId: props.serviceId,
      isRevision: props.isRevision,
      sizeForRevision: props.sizeForRevision,
      projectId: props.projectId,
      jobId: props.jobId,
      description: props.description,
      price: props.price === null ? null : new Prisma.Decimal(props.price),
      priceOverride: props.priceOverride === null ? null : new Prisma.Decimal(props.priceOverride),
      status: props.status,
      orderedAt: props.orderedAt,
      doneAt: props.doneAt,
      is_manual_price: entity.getProps().isManualPrice,
    }
  }

  toDomain(record: OrderedServices & { assignedTasks: AssignedTasks[] }): OrderedServiceEntity {
    const entity = new OrderedServiceEntity({
      id: record.id,
      props: {
        serviceId: record.serviceId,
        projectId: record.projectId,
        jobId: record.jobId,
        isRevision: record.isRevision,
        sizeForRevision: record.sizeForRevision
          ? OrderedServiceSizeForRevisionEnum[record.sizeForRevision as OrderedServiceSizeForRevision]
          : null,
        description: record.description,
        price: record.price === null ? null : Number(record.price),
        priceOverride: record.priceOverride === null ? null : Number(record.priceOverride),
        orderedAt: record.orderedAt,
        doneAt: record.doneAt,
        status: record.status as OrderedServiceStatus,
        isManualPrice: record.is_manual_price, //record.isManualPrice,
        assignedTasks: record.assignedTasks,
      },
    })
    return entity
  }

  toResponse(entity: OrderedServiceEntity): OrderedServiceResponseDto {
    throw new Error('Method not implemented.')
  }
}
