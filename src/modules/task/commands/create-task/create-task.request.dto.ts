import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsString } from 'class-validator'
import { LicenseTypeEnum } from '../../../license/dtos/license.response.dto'

export class CreateTaskRequestDto {
  @ApiProperty({ default: '618d6167-0cff-4c0f-bbf6-ed7d6e14e2f1' })
  @IsString()
  readonly serviceId: string

  @ApiProperty({ default: 'PV Design QA/QC' })
  @IsString()
  readonly name: string

  @ApiProperty({ default: LicenseTypeEnum.structural, enum: LicenseTypeEnum })
  @IsEnum(LicenseTypeEnum)
  @IsOptional()
  readonly licenseType: LicenseTypeEnum | null
}
