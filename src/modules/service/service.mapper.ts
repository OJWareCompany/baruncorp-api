import { Prisma, Service } from '@prisma/client'
import { Mapper } from '../../libs/ddd/mapper.interface'
import { ServiceEntity } from './domain/service/service.entity'
import { ServiceResponseDto } from './dtos/service.response.dto'

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

  toDomain(record: Service): ServiceEntity {
    const entity = new ServiceEntity({
      id: record.id,
      props: {
        name: record.name,
        billingCode: record.billingCode,
        basePrice: Number(record.basePrice),
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
    })
    return response
  }
}
