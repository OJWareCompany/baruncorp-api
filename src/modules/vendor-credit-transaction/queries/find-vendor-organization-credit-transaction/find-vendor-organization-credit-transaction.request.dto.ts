import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class FindOrganizationCreditTransactionRequestDto {
  @ApiProperty({ default: '9988799b-6ca2-4544-8914-a5c88805e225' })
  @IsString()
  readonly vendorOrganizationId: string
}
