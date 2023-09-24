import { OrderedServices } from '@prisma/client'
import { Mapper } from '../../libs/ddd/mapper.interface'
import { OrderedServiceEntity } from './domain/ordered-service.entity'
import { OrderedServiceResponse } from './dtos/ordered-service.response.dto'

export class OrderedServiceMapper implements Mapper<OrderedServiceEntity, OrderedServices, OrderedServiceResponse> {
  toPersistence(entity: OrderedServiceEntity): OrderedServices {
    throw new Error('Method not implemented.')
  }
  toDomain(record: OrderedServices): OrderedServiceEntity {
    throw new Error('Method not implemented.')
  }
  toResponse(entity: OrderedServiceEntity): OrderedServiceResponse {
    throw new Error('Method not implemented.')
  }
}
