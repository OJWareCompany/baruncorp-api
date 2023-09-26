import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class FindAssignedTaskPaginatedRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly jobId: string
}
