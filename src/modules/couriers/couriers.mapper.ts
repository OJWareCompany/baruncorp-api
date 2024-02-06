import { Injectable } from '@nestjs/common'
import { Mapper } from '../../libs/ddd/mapper.interface'
import { Couriers } from '@prisma/client'
import { CouriersEntity } from '@modules/couriers/domain/couriers.entity'
import { CouriersModel } from '@modules/couriers/database/couriers.repository'

@Injectable()
export class CouriersMapper implements Mapper<CouriersEntity, CouriersModel> {
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

  toResponse(entity: CouriersEntity, ...dtos: any) {
    throw new Error('Method not implemented.')
  }
}
