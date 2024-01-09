import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNumber, IsOptional, IsString, Max } from 'class-validator'

export class UpdatePtoTenurePolicyParamRequestDto {
  @ApiProperty({ default: '529cec06-1fb7-4284-b56f-9f31219cd099' })
  @IsString()
  readonly ptoTenurePolicyId: string
}

export class UpdatePtoTenurePolicyRequestDto {
  @ApiProperty({ default: 12, maximum: 30, required: false })
  @IsOptional()
  @IsNumber()
  @Max(30)
  readonly total?: number
}
