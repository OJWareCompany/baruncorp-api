import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class FindExpensePricingRequestDto {
  @ApiProperty()
  @IsString()
  readonly taskId: string

  @ApiProperty()
  @IsString()
  readonly organizationId: string
}
