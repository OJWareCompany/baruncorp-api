import { Injectable } from '@nestjs/common'
import { Mapper } from '../../libs/ddd/mapper.interface'
import { PtoResponseDto } from './dtos/pto.response.dto'
import { PtoEntity } from './domain/pto.entity'
import { PtoModel, PtoQueryModel } from './database/pto.repository'
import { PtoDetail } from './domain/value-objects/pto.detail.vo'

@Injectable()
export class PtoMapper implements Mapper<PtoEntity, PtoModel, PtoResponseDto> {
  toPersistence(entity: PtoEntity): PtoModel {
    const props = entity.getProps()
    const record: PtoModel = {
      id: props.id,
      userId: props.userId,
      tenure: props.tenure,
      total: props.total,
      isPaid: props.isPaid,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    }
    return record
  }

  toDomain(record: PtoQueryModel): PtoEntity {
    const entity = new PtoEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        userId: record.userId,
        tenure: record.tenure,
        total: record.total,
        isPaid: record.isPaid,
        details: record.details.map((ptoDetail) => {
          return new PtoDetail({
            id: ptoDetail.id,
            name: ptoDetail.ptoType.name,
            abbreviation: ptoDetail.ptoType.abbreviation,
            value: ptoDetail.value,
            startedAt: ptoDetail.startedAt,
            endedAt: ptoDetail.endedAt,
          })
        }),
      },
    })
    return entity
  }

  toResponse(entity: PtoEntity): PtoResponseDto {
    const props = entity.getProps()
    const response = new PtoResponseDto({
      id: props.id,
      userId: props.userId,
      tenure: props.tenure,
      total: props.total,
      isPaid: props.isPaid,
      details: props.details.map((ptoDetail) => {
        return new PtoDetail({
          id: ptoDetail.id,
          name: ptoDetail.name,
          abbreviation: ptoDetail.abbreviation,
          value: ptoDetail.value,
          startedAt: ptoDetail.startedAt,
          endedAt: ptoDetail.endedAt,
        })
      }),
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    })
    return response
  }
}
