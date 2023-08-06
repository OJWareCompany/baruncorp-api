import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNumber } from 'class-validator'

export class SignInTimeRequestDto {
  @ApiProperty({ default: 20 })
  @IsNumber()
  @Type(() => Number)
  jwt: number

  @ApiProperty({ default: 40 })
  @IsNumber()
  @Type(() => Number)
  refresh: number
}
