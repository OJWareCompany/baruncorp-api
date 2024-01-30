import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class FindIntegratedOrderModificationHistoryPaginatedRequestDto {
  @ApiProperty()
  @IsString()
  readonly jobId: string
}
