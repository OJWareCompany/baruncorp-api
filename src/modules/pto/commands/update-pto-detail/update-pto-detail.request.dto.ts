import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsDate, IsInt, IsNumber, IsOptional, IsString, Max } from 'class-validator'

export class UpdatePtoDetailParamRequestDto {
  @ApiProperty({ default: '529cec06-1fb7-4284-b56f-9f31219cd099' })
  @IsString()
  readonly ptoDetailId: string
}

export class UpdatePtoDetailRequestDto {
  @ApiProperty({ default: '2024-01-09', required: false })
  @IsOptional()
  @IsDate()
  readonly startedAt?: Date
  @ApiProperty({ default: 2, required: false })
  @IsOptional()
  @IsInt()
  readonly days?: number
  @ApiProperty({ default: '529cec06-1fb7-4284-b56f-9f31219cd099', required: false })
  @IsOptional()
  @IsString()
  readonly ptoTypeId?: string
  @ApiProperty({ default: 1, required: false })
  @IsOptional()
  @IsNumber()
  @Max(1)
  readonly amount?: number
}
