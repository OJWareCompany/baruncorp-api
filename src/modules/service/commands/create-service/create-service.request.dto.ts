import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'

export class CreateServiceRequestDto {
  @ApiProperty({ default: 'PV Design' })
  @IsString()
  readonly name: string

  @ApiProperty({ default: '' })
  @IsString()
  readonly billingCode: string

  @ApiProperty({ default: 100.0 })
  @IsNumber()
  readonly basePrice: number
}
