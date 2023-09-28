import { Injectable } from '@nestjs/common'
import { Mapper } from '@libs/ddd/mapper.interface'
import { UserEntity } from '@modules/users/domain/user.entity'
import { LicenseEntity } from '../users/user-license.entity'
import { State } from './domain/value-objects/state.vo'
import { LicenseModel } from './database/department.repository'
import { LicenseProps, LicenseType, CreateLicenseProps } from '../users/user-license.type'
import { LincenseResponseDto } from './dtos/license.response.dto'

@Injectable()
export class LicenseMapper implements Mapper<LicenseEntity, LicenseModel, LincenseResponseDto> {
  toPersistence(entity: LicenseEntity): LicenseModel {
    const props: LicenseProps = entity.getProps()
    const record: LicenseModel = {
      userId: props.userId,
      issuingCountryName: props.stateEntity.stateName,
      abbreviation: props.stateEntity.abbreviation,
      priority: props.priority,
      issuedDate: null,
      expiryDate: props.expiryDate,
      updatedAt: new Date(),
      createdAt: new Date(),
    }
    return record
  }

  toDomain(record: LicenseModel, type: LicenseType, user: UserEntity): LicenseEntity {
    const props: CreateLicenseProps = {
      userId: record.userId,
      userName: user.getProps().userName,
      stateEntity: new State({
        stateName: record.issuingCountryName,
        abbreviation: record.abbreviation,
        geoId: null,
        stateCode: null,
        ansiCode: null,
        stateLongName: null,
      }),
      type,
      priority: record.priority,
      // issuedDate: record.issuedDate,
      expiryDate: record.expiryDate,
    }

    return new LicenseEntity({ id: '', props })
  }

  toResponse(entity: LicenseEntity): LincenseResponseDto {
    const copyProps = entity.getProps()

    return new LincenseResponseDto({
      userName: copyProps.userName.getFullName(),
      type: copyProps.type,
      issuingCountryName: copyProps.stateEntity.stateName,
      abbreviation: copyProps.stateEntity.abbreviation,
      priority: copyProps.priority,
      expiryDate: copyProps.expiryDate?.toISOString() || null,
    })
  }
}
