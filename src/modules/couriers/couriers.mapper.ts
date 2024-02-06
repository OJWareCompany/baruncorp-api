import { Injectable } from '@nestjs/common'
import { Mapper } from '../../libs/ddd/mapper.interface'
import { CouriersEntity } from '@modules/couriers/domain/couriers.entity'
import { CouriersModel } from '@modules/couriers/database/couriers.repository'
import { CouriersResponseDto } from '@modules/couriers/dtos/couriers.response.dto'

@Injectable()
export class CouriersMapper implements Mapper<CouriersEntity, CouriersModel, CouriersResponseDto> {
  toPersistence(entity: CouriersEntity): CouriersModel {
    const record: CouriersModel = {
      id: entity.id,
      name: entity.name,
      trackingUrlParam: entity.urlParam,
    }

    return record
  }

  toDomain(record: CouriersModel): CouriersEntity {
    const entity: CouriersEntity = new CouriersEntity({
      id: record.id,
      props: {
        name: record.name,
        urlParam: record.trackingUrlParam,
      },
    })

    return entity
  }

  toResponse(entity: CouriersEntity): CouriersResponseDto {
    return new CouriersResponseDto({
      id: entity.id,
      name: entity.name,
      urlParam: entity.urlParam,
    })
  }
}
