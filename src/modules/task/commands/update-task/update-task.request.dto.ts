import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator'
import { LicenseTypeEnum } from '../../../license/dtos/license.response.dto'

export class UpdateTaskParamRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly taskId: string
}

export class UpdateTaskRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly name: string

  @ApiProperty({ default: LicenseTypeEnum.structural, enum: LicenseTypeEnum })
  @IsEnum(LicenseTypeEnum)
  @IsOptional()
  readonly licenseTyp: LicenseTypeEnum | null
}
