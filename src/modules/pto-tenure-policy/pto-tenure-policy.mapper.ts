import { Injectable } from '@nestjs/common'
import { Mapper } from '../../libs/ddd/mapper.interface'
import { PtoTenurePolicyResponseDto } from './dtos/pto-tenure-policy.response.dto'
import { PtoTenurePolicyEntity } from './domain/pto-tenure-policy.entity'
import { PtoTenurePoliciesModel, PtoTenurePoliciesQueryModel } from './database/pto-tenure-policy.repository'

@Injectable()
export class PtoTenurePolicyMapper
  implements Mapper<PtoTenurePolicyEntity, PtoTenurePoliciesModel, PtoTenurePolicyResponseDto>
{
  toPersistence(entity: PtoTenurePolicyEntity): PtoTenurePoliciesModel {
    const props = entity.getProps()
    const record: PtoTenurePoliciesModel = {
      id: props.id,
      tenure: props.tenure,
      total: props.total,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    }
    return record
  }

  toDomain(record: PtoTenurePoliciesQueryModel): PtoTenurePolicyEntity {
    const entity = new PtoTenurePolicyEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        tenure: record.tenure,
        total: record.total,
      },
    })
    return entity
  }

  toResponse(entity: PtoTenurePolicyEntity): PtoTenurePolicyResponseDto {
    const props = entity.getProps()
    const response = new PtoTenurePolicyResponseDto({
      id: props.id,
      tenure: props.tenure,
      total: props.total,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    })
    return response
  }
}
