import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CreateOrderedServiceRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly id: string
}
