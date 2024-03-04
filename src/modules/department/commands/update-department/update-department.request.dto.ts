import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class UpdateDepartmentParamRequestDto {
  @ApiProperty()
  @IsString()
  readonly departmentId: string
}

export class UpdateDepartmentRequestDto {
  @ApiProperty()
  @IsString()
  readonly name: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly description: string | null
}
