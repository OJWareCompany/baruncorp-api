import { Injectable } from '@nestjs/common'
import { Mapper } from '../../libs/ddd/mapper.interface'
import { CouriersEntity } from '@modules/couriers/domain/couriers.entity'
import { CouriersModel } from '@modules/couriers/database/couriers.repository'
import { CouriersResponseDto } from '@modules/couriers/dtos/couriers.response.dto'
import { TrackingNumbersEntity } from '@modules/tracking-numbers/domain/tracking-numbers.entity'
import {
  TrackingNumbersModel,
  TrackingNumbersQueryModel,
} from '@modules/tracking-numbers/database/tracking-numbers.repository'
import { TrackingNumbersResponseDto } from '@modules/tracking-numbers/dtos/tracking-numbers.response.dto'

@Injectable()
export class TrackingNumbersMapper
  implements Mapper<TrackingNumbersEntity, TrackingNumbersModel, TrackingNumbersResponseDto>
{
  toPersistence(entity: TrackingNumbersEntity): TrackingNumbersModel {
    const record: TrackingNumbersModel = {
      id: entity.id,
      jobId: entity.jobId,
      courierId: entity.courierId,
      trackingNumber: entity.trackingNumber,
      createdBy: entity.createdBy,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    }

    return record
  }

  toDomain(record: TrackingNumbersQueryModel): TrackingNumbersEntity {
    const entity: TrackingNumbersEntity = new TrackingNumbersEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        jobId: record.jobId,
        courierId: record.courierId,
        createdBy: record.createdBy,
        trackingNumber: record.trackingNumber,
      },
    })

    return entity
  }

  toResponse(entity: TrackingNumbersEntity): any {
    return true
  }
}
