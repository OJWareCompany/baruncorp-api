import { Injectable } from '@nestjs/common'
import { Mapper } from '../../libs/ddd/mapper.interface'
import { PtoResponseDto } from './dtos/pto.response.dto'
import { PtoEntity } from './domain/pto.entity'
import { PtoDetailModel, PtoDetailQueryModel, PtoModel, PtoQueryModel } from './database/pto.repository'
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
    }

    return record
  }

  toDetailPersistence(entity: PtoDetailEntity): PtoDetailModel {
    const props = entity.getProps()
    const record: PtoDetailModel = {
      id: props.id,
      ptoId: props.ptoId,
      ptoTypeId: props.ptoTypeId,
      amount: props.amount,
      days: props.days,
      startedAt: props.startedAt,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    }

    return record
  }

  toDomain(record: PtoQueryModel): PtoEntity {
    const entity: PtoEntity = new PtoEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        userId: record.userId,
        tenure: record.tenure,
        total: record.total,
        isPaid: record.isPaid,
        details: record.details.map((detail) => {
          return new PtoDetail({
            id: detail.id,
            name: detail.ptoType.name,
            abbreviation: detail.ptoType.abbreviation,
            amount: detail.amount,
            days: detail.days,
            startedAt: detail.startedAt,
          })
        }),
        dateOfJoining: record.user.dateOfJoining,
      },
    })

    return entity
  }

  toDetailDomain(record: PtoDetailQueryModel): PtoDetailEntity {
    const ptoDetailEntity: PtoDetailEntity = new PtoDetailEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        ptoId: record.ptoId,
        ptoTypeId: record.ptoTypeId,
        amount: record.amount,
        days: record.days,
        ownerUserId: record.pto.user.id,
        ownerUserDateOfJoining: record.pto.user.dateOfJoining,
        isPaid: record.pto.isPaid,
        name: record.ptoType.name,
        abbreviation: record.ptoType.abbreviation,
        startedAt: record.startedAt,
        parentPtoEntity: null,
      },
    })
    return ptoDetailEntity
  }

  toResponse(entity: PtoEntity): PtoResponseDto {
    const props = entity.getProps()
    const response = new PtoResponseDto({
      id: props.id,
      startedAt: entity.getStartedAt(),
      endedAt: entity.getEndedAt(),
      tenure: props.tenure,
      total: props.total,
      availablePto: entity.getUsablePtoValue(),
      isPaid: props.isPaid,
    })
    return response
  }
}
