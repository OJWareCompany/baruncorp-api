import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsString } from 'class-validator'

export class UpdateOrderedServiceParamRequestDto {
  @ApiProperty()
  @IsString()
  readonly orderedServiceId: string
}

export class UpdateOrderedServiceRequestDto {
  @ApiProperty({ default: '' })
  @IsNumber()
  readonly priceOverride: number

  @ApiProperty({ default: '' })
  @IsString()
  @IsOptional()
  readonly description: string | null
}
