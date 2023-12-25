import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'
import { LicenseTypeEnum } from '../../../license/dtos/license.response.dto'

export class CreatePositionRequestDto {
  @ApiProperty({ default: 'Sr. Designer Test' })
  @IsString()
  readonly name: string

  @ApiProperty({ default: 5 })
  @IsNumber()
  readonly maxAssignedTasksLimit: number | null

  @ApiProperty({ default: null, description: 'TODO: UPDATE license type (워커와 태스크가 등록된경우 변경 불가하도록)' })
  @IsEnum(LicenseTypeEnum)
  @IsOptional()
  readonly licenseType: LicenseTypeEnum | null

  @ApiProperty({ default: null })
  @IsString()
  @IsOptional()
  readonly description?: string | null
}
