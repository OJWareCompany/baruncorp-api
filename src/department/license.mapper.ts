import { LicenseModel } from './database/department.repository'
import { LincenseResponseDto } from './dto/license.response.dto'
import { LicenseEntity } from './entities/license.entity'
import { CreateLicenseProps, LicenseProps, LicenseType } from './interfaces/license.interface'
import { StateEntity } from './entities/state.entity'
import { Injectable } from '@nestjs/common'
import { UserEntity } from '../users/entities/user.entity'

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
    }
    return record
  }

  toDomain({ record, type }: { record: LicenseModel; type: LicenseType }, user: UserEntity): LicenseEntity {
    const props: CreateLicenseProps = {
      userId: record.userId,
      userName: user.getProps().userName,
      stateEntity: new StateEntity({ stateName: record.issuingCountryName, abbreviation: record.abbreviation }),
      type,
      priority: record.priority,
      issuedDate: record.issuedDate,
      expiryDate: record.expiryDate,
    }

    return new LicenseEntity({ ...props })
  }

  toResponse(entity: LicenseEntity): LincenseResponseDto {
    const copyProps = entity.getProps()
    const response = new LincenseResponseDto()
    response.abbreviation = copyProps.stateEntity.abbreviation
    response.issuingCountryName = copyProps.stateEntity.stateName
    response.expiryDate = copyProps.expiryDate
    response.issuedDate = copyProps.issuedDate
    response.priority = copyProps.priority
    response.type = copyProps.type
    response.userName = copyProps.userName.getFullName()
    return response
  }
}
