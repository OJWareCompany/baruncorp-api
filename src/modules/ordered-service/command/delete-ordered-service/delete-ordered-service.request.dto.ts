import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class DeleteOrderedServiceRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly orderedServiceId: string
}
