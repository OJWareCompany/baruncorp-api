import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class FindCreatableCustomPricingRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly organizationId: string
}
