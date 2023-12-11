import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class FindExpensePricingPaginatedRequestDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly taskId?: string | null

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly organizationId?: string | null
}
