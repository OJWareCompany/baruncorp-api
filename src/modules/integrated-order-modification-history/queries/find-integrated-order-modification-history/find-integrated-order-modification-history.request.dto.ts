import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class FindIntegratedOrderModificationHistoryRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly integratedOrderModificationHistoryId: string
}
