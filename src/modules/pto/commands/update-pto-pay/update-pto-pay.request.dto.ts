import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNumber, IsOptional, IsString, Max } from 'class-validator'

export class UpdatePtoPayParamRequestDto {
  @ApiProperty({ default: '529cec06-1fb7-4284-b56f-9f31219cd099' })
  @IsString()
  readonly ptoId: string
}

export class UpdatePtoPayRequestDto {
  @ApiProperty({ default: false })
  @IsBoolean()
  readonly isPaid: boolean
}
