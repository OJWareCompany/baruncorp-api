import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class FindOrderedServiceRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly orderedServiceId: string
}
