import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class FindCreditTransactionPaginatedRequestDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly organizationId?: string | null
}
