import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsDate, IsInt, IsNumber, IsString, Max } from 'class-validator'

export class CreatePtoRequestDto {
  @ApiProperty({ default: 'ebf47426-2f8d-4b7c-9ef1-81209db8e3ad' })
  @IsString()
  readonly userId: string
  @ApiProperty({ default: 1 })
  @IsInt()
  @Max(100)
  readonly tenure: number
  @ApiProperty({ default: 10 })
  @IsNumber()
  @Max(30)
  readonly total: number
}
