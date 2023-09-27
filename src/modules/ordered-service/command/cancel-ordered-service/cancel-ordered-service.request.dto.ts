import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CancelOrderedServiceParamRequestDto {
  @ApiProperty()
  @IsString()
  readonly orderedServiceId: string
}
