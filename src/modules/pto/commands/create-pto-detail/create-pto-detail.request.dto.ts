import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsDate, IsInt, IsNumber, IsString, Max } from 'class-validator'

export class CreatePtoDetailRequestDto {
  @ApiProperty({ default: 'ebf47426-2f8d-4b7c-9ef1-81209db8e3ad' })
  @IsString()
  readonly userId: string
  @ApiProperty({ default: 'ebf47426-2f8d-4b7c-9ef1-81209db8e3ad' })
  @IsString()
  readonly ptoTypeId: string
  @ApiProperty({ default: 1.5 })
  @IsNumber()
  readonly value: number
  @ApiProperty({ default: '2024-01-09T03:50:45.000Z' })
  @IsDate()
  readonly startedAt: Date
  @ApiProperty({ default: 2 })
  @IsInt()
  readonly days: number
}
