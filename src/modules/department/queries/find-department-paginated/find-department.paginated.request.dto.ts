import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class FindDepartmentPaginatedRequestDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly name?: string | null
}
