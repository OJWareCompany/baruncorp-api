import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'
import { CreateDepartmentRequestDto } from '../create-department/create-department.request.dto'

export class UpdateDepartmentParamRequestDto {
  @ApiProperty()
  @IsString()
  readonly departmentId: string
}

export class UpdateDepartmentRequestDto extends CreateDepartmentRequestDto {}
