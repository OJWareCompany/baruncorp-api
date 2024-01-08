import { Injectable } from '@nestjs/common'
import { Mapper } from '../../libs/ddd/mapper.interface'
import { PtoResponseDto } from './dtos/pto.response.dto'
import { PtoEntity } from './domain/pto.entity'
import { PtoModel, PtoQueryModel } from './database/pto.repository'
import { PtoAvailableValueResponseDto } from './dtos/pto-available-value.response.dto'
import { PtoAvailableValue } from './domain/value-objects/pto.available-value.vo'

@Injectable()
export class PtoMapper implements Mapper<PtoEntity, PtoModel, PtoResponseDto> {
  toPersistence(entity: PtoEntity): PtoModel {
    const props = entity.getProps()
    const record: PtoModel = {
      id: props.id,
      name: props.name,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    }
    return record
  }

  toDomain(record: PtoQueryModel): PtoEntity {
    const entity = new PtoEntity({
      id: record.id,
      props: {
        name: record.name,
        availableValues: record.availableValues.map((availableValue) => {
          return new PtoAvailableValue({
            value: availableValue.value,
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
      name: props.name,
      availableValues: props.availableValues.map((availableValue) => {
        return new PtoAvailableValueResponseDto({
          value: availableValue.value,
        })
      }),
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    })
    return response
  }
}
