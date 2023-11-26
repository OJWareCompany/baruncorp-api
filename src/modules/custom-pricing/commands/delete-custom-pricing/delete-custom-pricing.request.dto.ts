import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class DeleteCustomPricingParamRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly customPricingId: string
}

export class DeleteCustomPricingRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly id: string
}
