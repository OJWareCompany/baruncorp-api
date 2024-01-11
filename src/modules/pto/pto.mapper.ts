import { Injectable } from '@nestjs/common'
import { Mapper } from '../../libs/ddd/mapper.interface'
import { PtoResponseDto } from './dtos/pto.response.dto'
import { PtoEntity } from './domain/pto.entity'
import { PtoModel, PtoQueryModel } from './database/pto.repository'
import { PtoDetail } from './domain/value-objects/pto.detail.vo'
import { PtoDetailEntity } from './domain/pto-detail.entity'

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
      details: props.details.map((ptoDetail) => {
        const ptoDetailprops = ptoDetail.getProps()
        return {
          id: ptoDetailprops.id,
          ptoId: ptoDetailprops.ptoId,
          ptoTypeId: ptoDetailprops.ptoTypeId,
          value: ptoDetailprops.value,
          days: ptoDetailprops.days,
          startedAt: ptoDetailprops.startedAt,
          endedAt: ptoDetailprops.endedAt,
          createdAt: ptoDetailprops.createdAt,
          updatedAt: ptoDetailprops.updatedAt,
        }
      }),
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
          const ptoDetailEntity: PtoDetailEntity = new PtoDetailEntity({
            id: ptoDetail.id,
            createdAt: ptoDetail.createdAt,
            updatedAt: ptoDetail.updatedAt,
            props: {
              ptoId: ptoDetail.ptoId,
              ptoTypeId: ptoDetail.ptoTypeId,
              value: ptoDetail.value,
              days: ptoDetail.days,
              name: ptoDetail.ptoType.name,
              abbreviation: ptoDetail.ptoType.abbreviation,
              startedAt: ptoDetail.startedAt,
              endedAt: ptoDetail.endedAt,
            },
          })

          return ptoDetailEntity
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
        const ptoDetailprops = ptoDetail.getProps()
        return new PtoDetail({
          id: ptoDetailprops.id,
          name: ptoDetailprops.name ?? '',
          abbreviation: ptoDetailprops.abbreviation ?? '',
          value: ptoDetailprops.value,
          days: ptoDetailprops.days,
          startedAt: ptoDetailprops.startedAt,
          endedAt: ptoDetailprops.endedAt,
        })
      }),
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    })
    return response
  }
}
