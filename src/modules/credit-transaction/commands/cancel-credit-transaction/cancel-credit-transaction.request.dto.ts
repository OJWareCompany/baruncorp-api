import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CancelCreditTransactionParamRequestDto {
  @ApiProperty()
  @IsString()
  readonly creditTransactionId: string
}
