import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class DeletePtoDetailParamRequestDto {
  @ApiProperty({ default: '529cec06-1fb7-4284-b56f-9f31219cd099' })
  @IsString()
  readonly ptoDetailId: string
}
