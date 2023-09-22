import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'

export class UpdateServiceRequestDtoParam {
  @ApiProperty()
  @IsString()
  readonly serviceId: string
}

export class UpdateServiceRequestDto {
  @ApiProperty({ default: 'PV Design' })
  @IsString()
  readonly name: string

  @ApiProperty({ default: 'PV' })
  @IsString()
  readonly billingCode: string

  @ApiProperty({ default: 100.2 })
  @IsNumber()
  readonly basePrice: number
}
