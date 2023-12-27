import { ApiProperty } from '@nestjs/swagger'
import { AutoAssignmentTypeEnum } from '../../position/domain/position.type'
import { IsEnum, IsOptional } from 'class-validator'
import { LicenseTypeEnum } from '../../license/dtos/license.response.dto'

export class AvailableTaskResponseDto {
  @ApiProperty({ default: '' })
  readonly id: string

  @ApiProperty({ default: '' })
  readonly name: string

  @ApiProperty({ default: AutoAssignmentTypeEnum.all, enum: AutoAssignmentTypeEnum })
  @IsEnum(AutoAssignmentTypeEnum)
  readonly autoAssignmentType: AutoAssignmentTypeEnum

  @ApiProperty({ default: LicenseTypeEnum.structural, enum: LicenseTypeEnum })
  @IsEnum(LicenseTypeEnum)
  @IsOptional()
  readonly licenseType: LicenseTypeEnum | null
}
