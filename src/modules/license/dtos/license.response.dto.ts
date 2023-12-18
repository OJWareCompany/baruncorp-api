import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsString } from 'class-validator'
import { initialize } from '../../../libs/utils/constructor-initializer'

export enum LicenseTypeEnum {
  structural = 'Structural',
  electrical = 'Electrical',
}

export class LicensedWorker {
  @ApiProperty()
  @IsString()
  userId: string

  @ApiProperty()
  @IsString()
  userName: string

  @ApiProperty({ default: LicenseTypeEnum.structural })
  @IsEnum(LicenseTypeEnum)
  type: string

  @ApiProperty()
  @IsString()
  expiryDate: string | null

  @ApiProperty()
  @IsString()
  updatedAt: string

  @ApiProperty()
  @IsString()
  createdAt: string
}

export class LicenseResponseDto {
  @ApiProperty({ default: LicenseTypeEnum.structural, enum: LicenseTypeEnum })
  @IsEnum(LicenseTypeEnum)
  readonly type: LicenseTypeEnum

  @ApiProperty({ default: 'ALASKA' })
  @IsString()
  readonly state: string

  @ApiProperty({ default: 'AK' })
  @IsString()
  readonly abbreviation: string

  readonly workers: LicensedWorker[]

  constructor(props: LicenseResponseDto) {
    initialize(this, props)
  }
}
