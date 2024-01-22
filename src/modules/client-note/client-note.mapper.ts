import { Injectable } from '@nestjs/common'
import { Mapper } from '../../libs/ddd/mapper.interface'
import { ClientNoteResponseDto } from './dtos/client-note.response.dto'
import { ClientNoteEntity } from './domain/client-note.entity'
import { ClientNoteModel, ClientNoteQueryModel, ClientNoteSnapshotsModel } from './database/client-note.repository'
import { Prisma } from '@prisma/client'
import { ClientNoteSnapshotEntity } from './domain/client-note-snapshot.entity'
import { ClientNoteSnapshot } from './domain/value-objects/client-not-snapshot.vo'

@Injectable()
export class ClientNoteMapper implements Mapper<ClientNoteEntity, ClientNoteModel, ClientNoteResponseDto> {
  toPersistence(entity: ClientNoteEntity): ClientNoteModel {
    const props = entity.getProps()

    const record: ClientNoteModel = {
      id: props.id,
      organizationId: props.organizationId,
      createdAt: props.createdAt,
    }
    return record
  }

  toClientNoteSnapshotPersistence(entity: ClientNoteSnapshotEntity): ClientNoteSnapshotsModel {
    const props = entity.getProps()

    const record: ClientNoteSnapshotsModel = {
      id: props.id,
      clientNoteId: props.clientNoteId,
      designNotes: props.designNotes,
      electricalEngineeringNotes: props.electricalEngineeringNotes,
      structuralEngineeringNotes: props.structuralEngineeringNotes,
      type: props.type,
      updatedBy: props.updatedBy,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    }
    return record
  }

  toDomain(record: ClientNoteQueryModel): ClientNoteEntity {
    const entity = new ClientNoteEntity({
      id: record.id,
      createdAt: record.createdAt,
      props: {
        snapshots: record.snapshots.map((snapshot) => {
          return new ClientNoteSnapshot({
            id: snapshot.id,
            updateUserId: snapshot.updatedBy,
            updateUserName: snapshot.user.full_name,
            type: snapshot.type,
            designNotes: snapshot.designNotes,
            electricalEngineeringNotes: snapshot.electricalEngineeringNotes,
            structuralEngineeringNotes: snapshot.structuralEngineeringNotes,
            createdAt: snapshot.createdAt,
          })
        }),
        organizationId: record.organizationId,
      },
    })
    return entity
  }
  // 사용 하지 않음
  toResponse(entity: ClientNoteEntity): ClientNoteResponseDto {
    const props = entity.getProps()
    const response = new ClientNoteResponseDto({
      id: props.id,
      userName: '',
      type: '',
      updatedAt: new Date(),
    })
    return response
  }
}
