import { Injectable } from '@nestjs/common'
import { Mapper } from '../../libs/ddd/mapper.interface'
import {
  UtilityModel,
  UtilityQueryModel,
  UtilitySnapshotModel,
  UtilitySnapshotQueryModel,
} from './database/utility.repository'
import { UtilitySnapshotEntity } from './domain/utility-snapshot.entity'
import { UtilityEntity } from '@modules/utility/domain/utility.entity'
import { UtilityResponseDto } from '@modules/utility/dtos/utility.response.dto'

@Injectable()
export class UtilityMapper implements Mapper<UtilityEntity, UtilityModel, UtilityResponseDto> {
  toPersistence(entity: UtilityEntity): UtilityModel {
    const record: UtilityModel = {
      id: entity.id,
      name: entity.name,
      stateAbbreviations: entity.stateAbbreviations.toString(),
      notes: entity.notes,
    }
    return record
  }

  toSnapshotPersistence(entity: UtilitySnapshotEntity): UtilitySnapshotModel {
    const props = entity.getProps()

    const record: UtilitySnapshotModel = {
      id: props.id,
      updatedBy: props.updatedBy,
      utilityId: props.utilityId,
      name: props.name,
      stateAbbreviations: props.stateAbbreviations.toString(),
      notes: props.notes,
      type: props.type,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    }
    return record
  }

  toDomain(record: UtilityQueryModel): UtilityEntity {
    const entity: UtilityEntity = new UtilityEntity({
      id: record.id,
      props: {
        name: record.name,
        stateAbbreviations: record.stateAbbreviations.split(','),
        notes: record.notes,
      },
    })
    return entity
  }
  // 사용 하지 않음
  toResponse(entity: UtilityEntity): any {
    return
  }
}
