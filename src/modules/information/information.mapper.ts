import { Injectable } from '@nestjs/common'
import { Mapper } from '../../libs/ddd/mapper.interface'
import { InformationResponseDto } from './dtos/information.response.dto'
import { InformationEntity } from './domain/information.entity'
import { InformationHistoryModel, InformationModel, InformationQueryModel } from './database/information.repository'
import { Prisma } from '@prisma/client'
import { InformationHistoryEntity } from './domain/information-history.entity'

@Injectable()
export class InformationMapper implements Mapper<InformationEntity, InformationModel, InformationResponseDto> {
  toPersistence(entity: InformationEntity): InformationModel {
    const props = entity.getProps()

    const record: InformationModel = {
      id: props.id,
      contents: JSON.stringify(props.contents),
      isActive: props.isActive,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    }
    return record
  }

  toHistoryPersistence(entity: InformationHistoryEntity): InformationHistoryModel {
    const props = entity.getProps()

    const record: InformationHistoryModel = {
      id: props.id,
      contents: JSON.stringify(props.contents),
      updatedBy: props.updatedBy,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    }
    return record
  }

  toDomain(record: InformationQueryModel): InformationEntity {
    const entity = new InformationEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        contents: JSON.parse(record.contents),
        isActive: record.isActive,
      },
    })
    return entity
  }

  toResponse(entity: InformationEntity): InformationResponseDto {
    const props = entity.getProps()
    const response = new InformationResponseDto({
      id: props.id,
      contents: props.contents,
      isActive: props.isActive,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    })
    return response
  }
}
