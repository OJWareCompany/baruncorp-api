import { Prisma, Service, Tasks } from '@prisma/client'
import { Mapper } from '../../libs/ddd/mapper.interface'
import { ServiceResponseDto } from './dtos/service.response.dto'
import { ServiceEntity } from './domain/service.entity'

export class ServiceMapper implements Mapper<ServiceEntity, Service, ServiceResponseDto> {
  toPersistence(entity: ServiceEntity): Service {
    const props = entity.getProps()
    const record: Service = {
      id: props.id,
      name: props.name,
      billingCode: props.billingCode,
      basePrice: new Prisma.Decimal(props.basePrice),
    }
    return record
  }

  toDomain(record: Service & { tasks: Tasks[] }): ServiceEntity {
    const entity = new ServiceEntity({
      id: record.id,
      props: {
        name: record.name,
        billingCode: record.billingCode,
        basePrice: Number(record.basePrice),
        tasks: record.tasks,
      },
    })
    return entity
  }

  toResponse(entity: ServiceEntity): ServiceResponseDto {
    const props = entity.getProps()
    const response = new ServiceResponseDto({
      id: props.id,
      name: props.name,
      billingCode: props.billingCode,
      basePrice: props.basePrice,
      relatedTasks: props.tasks,
    })
    return response
  }
}
