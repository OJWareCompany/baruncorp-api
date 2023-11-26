import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class FindCustomPricingPaginatedRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly customPricingId: string
}
