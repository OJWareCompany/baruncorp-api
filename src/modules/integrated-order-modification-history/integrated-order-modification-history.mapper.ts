import { IntegratedOrderModificationHistory } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { Mapper } from '../../libs/ddd/mapper.interface'
import { IntegratedOrderModificationHistoryResponseDto } from './dtos/integrated-order-modification-history.response.dto'
import { IntegratedOrderModificationHistoryEntity } from './domain/integrated-order-modification-history.entity'
import { OrderModificationHistoryOperationEnum } from './domain/integrated-order-modification-history.type'

class Fields implements IntegratedOrderModificationHistory {
  jobId: string
  modifiedAt: Date
  modifiedBy: string
  entity: string
  entityId: string
  scopeOrTaskName: string | null
  attribute: string | null
  operation: string
  afterValue: string | null
  beforeValue: string | null
}

@Injectable()
export class IntegratedOrderModificationHistoryMapper
  implements
    Mapper<
      IntegratedOrderModificationHistoryEntity,
      IntegratedOrderModificationHistory,
      IntegratedOrderModificationHistoryResponseDto
    >
{
  toPersistence(entity: IntegratedOrderModificationHistoryEntity): IntegratedOrderModificationHistory {
    const props = entity.getProps()
    const record: IntegratedOrderModificationHistory = {
      entityId: entity.id,
      jobId: '',
      modifiedAt: new Date(),
      modifiedBy: '',
      entity: '',
      scopeOrTaskName: null,
      attribute: null,
      operation: '',
      afterValue: null,
      beforeValue: null,
    }
    return record
  }

  toDomain(record: IntegratedOrderModificationHistory): IntegratedOrderModificationHistoryEntity {
    const entity = new IntegratedOrderModificationHistoryEntity({
      id: 'record.id',
      props: {
        name: '',
        // entityId: 'entity.id',
        // jobId: '',
        // modifiedAt: new Date(),
        // modifiedBy: '',
        // entity: '',
        // scopeOrTaskName: null,
        // attribute: null,
        // operation: '',
        // afterValue: null,
        // beforeValue: null,
      },
    })
    return entity
  }

  toResponse(entity: IntegratedOrderModificationHistoryEntity): IntegratedOrderModificationHistoryResponseDto {
    const props = entity.getProps()
    const response = new IntegratedOrderModificationHistoryResponseDto({
      jobId: '',
      modifiedBy: '',
      entity: '',
      entityId: '',
      modifiedAt: new Date(),
      scopeOrTaskName: '',
      attribute: '',
      afterValue: '',
      beforeValue: '',
      operation: OrderModificationHistoryOperationEnum.Create,
    })
    return response
  }
}
