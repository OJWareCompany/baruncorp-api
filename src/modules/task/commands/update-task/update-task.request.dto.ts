import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator'
import { LicenseRequiredEnum } from '../../domain/task.type'

export class UpdateTaskParamRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly taskId: string
}

export class UpdateTaskRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly name: string

  @ApiProperty({ default: LicenseRequiredEnum.structural, enum: LicenseRequiredEnum })
  @IsEnum(LicenseRequiredEnum)
  @IsOptional()
  readonly licenseRequired: LicenseRequiredEnum | null

  @ApiProperty({ default: true })
  @IsBoolean()
  readonly isAutoAssignment: boolean
}
