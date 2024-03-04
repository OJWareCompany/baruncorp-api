import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class DeleteDepartmentParamRequestDto {
  @ApiProperty()
  @IsString()
  readonly departmentId: string
}

export class DeleteDepartmentRequestDto {}
