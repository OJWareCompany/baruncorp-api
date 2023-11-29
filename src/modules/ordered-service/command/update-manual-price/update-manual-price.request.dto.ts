import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'

export class UpdateManualPriceParamRequestDto {
  @ApiProperty()
  @IsString()
  readonly orderedServiceId: string
}

export class UpdateManualPriceRequestDto {
  @ApiProperty({ default: '' })
  @IsNumber()
  readonly price: number
}
