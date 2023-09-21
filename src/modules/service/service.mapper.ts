import { Mapper } from '@src/libs/ddd/mapper.interface'
import { ServiceEntity } from './domain/service.entity'
import { ServiceResponseDto } from './dtos/service.response.dto'

class ServiceMapper implements Mapper<ServiceEntity, any, ServiceResponseDto> {
  toPersistence(entity: ServiceEntity) {
    throw new Error('Method not implemented.')
  }
  toDomain(record: any, ...entity: any): ServiceEntity {
    throw new Error('Method not implemented.')
  }
  toResponse(entity: ServiceEntity, ...dtos: any): ServiceResponseDto {
    throw new Error('Method not implemented.')
  }
}
