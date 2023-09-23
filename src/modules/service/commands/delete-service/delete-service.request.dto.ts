import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class DeleteServiceRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly serviceId: string
}
