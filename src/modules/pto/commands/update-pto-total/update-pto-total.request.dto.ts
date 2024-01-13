import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNumber, IsOptional, IsString, Max } from 'class-validator'

export class UpdatePtoTotalParamRequestDto {
  @ApiProperty({ default: '529cec06-1fb7-4284-b56f-9f31219cd099' })
  @IsString()
  readonly ptoId: string
}

export class UpdatePtoTotalRequestDto {
  @ApiProperty({ default: 12 })
  @IsNumber()
  @Max(30)
  readonly total: number
}
