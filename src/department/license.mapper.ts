import { LicenseModel } from './database/department.repository'
import { LincenseResponseDto } from '../users/dtos/license.response.dto'
import { Injectable } from '@nestjs/common'
import { UserEntity } from '../users/domain/user.entity'
import { CreateLicenseProps, LicenseEntity, LicenseProps, LicenseType } from '../users/user-license.entity'
import { State } from './domain/value-objects/state.vo'

export interface Mapper<DomainEntity, DbRecord, Response = any> {
  toPersistence(entity: DomainEntity): DbRecord
  toDomain(record: any, ...entity: any): DomainEntity
  toResponse(entity: DomainEntity, ...dtos: any): Response
}

@Injectable()
export class LicenseMapper implements Mapper<LicenseEntity, LicenseModel, LincenseResponseDto> {
  toPersistence(entity: LicenseEntity): LicenseModel {
    const props: LicenseProps = entity.getProps()
    const record: LicenseModel = {
      userId: props.userId,
      issuingCountryName: props.stateEntity.stateName,
      abbreviation: props.stateEntity.abbreviation,
      priority: props.priority,
      issuedDate: props.issuedDate,
      expiryDate: props.expiryDate,
      updatedAt: new Date(),
      createdAt: new Date(),
    }
    return record
  }

  toDomain({ record, type }: { record: LicenseModel; type: LicenseType }, user: UserEntity): LicenseEntity {
    const props: CreateLicenseProps = {
      userId: record.userId,
      userName: user.getProps().userName,
      stateEntity: new State({ stateName: record.issuingCountryName, abbreviation: record.abbreviation }),
      type,
      priority: record.priority,
      issuedDate: record.issuedDate,
      expiryDate: record.expiryDate,
    }

    return new LicenseEntity({ ...props })
  }

  toResponse(entity: LicenseEntity): LincenseResponseDto {
    const copyProps = entity.getProps()

    return new LincenseResponseDto({
      userName: copyProps.userName.getFullName(),
      type: copyProps.type,
      issuingCountryName: copyProps.stateEntity.stateName,
      abbreviation: copyProps.stateEntity.abbreviation,
      priority: copyProps.priority,
      issuedDate: copyProps.issuedDate,
      expiryDate: copyProps.expiryDate,
    })
  }
}
