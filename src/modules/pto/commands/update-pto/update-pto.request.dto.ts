import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class UpdatePtoParamRequestDto {
  @ApiProperty({ default: '529cec06-1fb7-4284-b56f-9f31219cd099' })
  @IsString()
  readonly ptoId: string
}

export class UpdatePtoRequestDto {
  @ApiProperty({ default: 'Vacation' })
  @IsString()
  readonly name: string
}
