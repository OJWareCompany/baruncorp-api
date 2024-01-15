import { Injectable } from '@nestjs/common'
import { Mapper } from '../../libs/ddd/mapper.interface'
import { PtoResponseDto } from './dtos/pto.response.dto'
import { PtoEntity } from './domain/pto.entity'
import { PtoDetailModel, PtoDetailQueryModel, PtoModel, PtoQueryModel } from './database/pto.repository'
import { PtoDetail } from './domain/value-objects/pto.detail.vo'
import { PtoDetailEntity } from './domain/pto-detail.entity'
import { PtoTargetUser } from './domain/value-objects/target.user.vo'

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
      startedAt: props.startedAt!,
      endedAt: props.endedAt!,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    }

    return record
  }

  toDetailPersistence(entity: PtoDetailEntity): PtoDetailModel {
    const props = entity.getProps()
    const record: PtoDetailModel = {
      id: props.id,
      userId: props.userId,
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
        startedAt: record.startedAt,
        endedAt: record.endedAt,
        targetUser: new PtoTargetUser({
          id: record.user.id,
          dateOfJoining: record.user.dateOfJoining,
          firstName: record.user.firstName,
          lastName: record.user.lastName,
        }),
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
        dateOfJoining: record.user.dateOfJoining!,
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
        userId: record.userId,
        ptoId: record.ptoId,
        ptoTypeId: record.ptoTypeId,
        amount: record.amount,
        days: record.days,
        ownerUserId: record.user.id,
        ownerUserDateOfJoining: record.user.dateOfJoining,
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
      userDateOfJoining: props.dateOfJoining.toISOString().split('T')[0],
      userFirstName: props.targetUser ? props.targetUser.firstName : '',
      userLastName: props.targetUser ? props.targetUser.lastName : '',
      startedAt: props.startedAt ? props.startedAt.toISOString().split('T')[0] : '',
      endedAt: props.endedAt ? props.endedAt.toISOString().split('T')[0] : '',
      tenure: props.tenure,
      total: props.total,
      availablePto: entity.getUsablePtoValue(),
      isPaid: props.isPaid,
    })
    return response
  }
}
