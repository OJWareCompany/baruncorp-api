import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class FindCustomPricingRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly customPricingId: string
}
