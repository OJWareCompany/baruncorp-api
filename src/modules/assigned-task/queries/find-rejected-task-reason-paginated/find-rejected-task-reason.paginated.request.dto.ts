import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class FindRejectedTaskReasonPaginatedRequestDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  userName?: string | null
}
