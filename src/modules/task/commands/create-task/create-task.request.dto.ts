import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator'
import { LicenseRequiredEnum } from '../../domain/task.type'

export class CreateTaskRequestDto {
  @ApiProperty({ default: '618d6167-0cff-4c0f-bbf6-ed7d6e14e2f1' })
  @IsString()
  readonly serviceId: string

  @ApiProperty({ default: 'PV Design QA/QC' })
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
