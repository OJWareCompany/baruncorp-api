import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class FindDepartmentRequestDto {
  @ApiProperty()
  @IsString()
  readonly departmentId: string
}
