import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class DeleteCustomPricingParamRequestDto {
  @ApiProperty()
  @IsString()
  readonly organizationId: string

  @ApiProperty()
  @IsString()
  readonly serviceId: string
}

export class DeleteCustomPricingRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly id: string
}
