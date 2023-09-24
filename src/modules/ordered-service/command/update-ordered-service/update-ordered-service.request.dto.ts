import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class UpdateOrderedServiceRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly id: string
}
