import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class FindPtoRequestDto {
  @ApiProperty({ default: 'ebf47426-2f8d-4b7c-9ef1-81209db8e3ad' })
  @IsString()
  readonly ptoId: string
}
