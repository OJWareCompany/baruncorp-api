import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class FindCreatableExpensePricingRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly organizationId: string
}
