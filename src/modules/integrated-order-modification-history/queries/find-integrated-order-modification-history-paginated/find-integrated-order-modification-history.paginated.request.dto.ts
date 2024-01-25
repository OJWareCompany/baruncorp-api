import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class FindIntegratedOrderModificationHistoryPaginatedRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly integratedOrderModificationHistoryId: string
}
