import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class FindCreditTransactionRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly creditTransactionId: string
}
