import { Injectable } from '@nestjs/common'
import { Mapper } from './license.mapper'
import { ServiceEntity } from './entities/service.entity'
import { ServiceModel } from './database/department.repository'

export class ServiceResponseDto {
  id: string
  name: string
  description: string
}

@Injectable()
export class ServiceMapper implements Mapper<ServiceEntity, ServiceModel, ServiceResponseDto> {
  toPersistence(entity: ServiceEntity): ServiceModel {
    const props = entity.getProps()
    const record: ServiceModel = {
      id: props.id,
      name: props.description,
      description: props.description,
    }
    return record
  }

  toDomain(record: ServiceModel): ServiceEntity {
    const props = {
      name: record.name,
      description: record.description,
    }

    return new ServiceEntity({ id: record.id, props })
  }

  toResponse(entity: ServiceEntity): ServiceResponseDto {
    const copy = entity.getProps()
    const response = new ServiceResponseDto()
    response.id = copy.id
    response.name = copy.name
    response.description = copy.description
    return response
  }
}
