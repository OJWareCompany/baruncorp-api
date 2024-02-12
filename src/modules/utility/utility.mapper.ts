import { Injectable } from '@nestjs/common'
import { Mapper } from '../../libs/ddd/mapper.interface'
import { ClientNoteResponseDto } from './dtos/client-note.response.dto'
import { UtilitySnapshotModel, UtilitySnapshotQueryModel } from './database/utility.repository'
import { UtilitySnapshotEntity } from './domain/utility-snapshot.entity'
import { UtilitySnapshotTypeEnum } from '@modules/utility/domain/utility-snapshot.type'

@Injectable()
export class UtilityMapper implements Mapper<UtilitySnapshotEntity, UtilitySnapshotModel, ClientNoteResponseDto> {
  toPersistence(entity: UtilitySnapshotEntity): UtilitySnapshotModel {
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

  toDomain(record: UtilitySnapshotQueryModel): UtilitySnapshotEntity {
    const entity: UtilitySnapshotEntity = new UtilitySnapshotEntity({
      id: record.id,
      props: {
        utilityId: record.utilityId,
        updatedBy: record.updatedBy,
        name: record.name,
        stateAbbreviations: record.stateAbbreviations?.split(',') || [],
        notes: record.notes,
        type: record.type.toString() === 'Create' ? UtilitySnapshotTypeEnum.Create : UtilitySnapshotTypeEnum.Modify,
      },
    })
    return entity
  }
  // 사용 하지 않음
  toResponse(entity: UtilitySnapshotEntity): any {
    return
  }
}
