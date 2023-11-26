import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class UpdateCustomPricingParamRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly customPricingId: string
}

export class UpdateCustomPricingRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly id: string
}
