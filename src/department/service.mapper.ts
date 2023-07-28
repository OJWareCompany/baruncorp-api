import { Injectable } from '@nestjs/common'
import { Mapper } from './license.mapper'
import { ServiceModel } from './database/department.repository'
import { ServiceEntity } from './domain/service.entity'
import { ServiceResponseDto } from './dtos/service.response.dto'

@Injectable()
export class ServiceMapper implements Mapper<ServiceEntity, ServiceModel, ServiceResponseDto> {
  toPersistence(entity: ServiceEntity): ServiceModel {
    const props = entity.getProps()
    const record: ServiceModel = {
      id: props.id,
      name: props.description,
      description: props.description,
      updatedAt: new Date(),
      createdAt: new Date(),
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
