import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsString } from 'class-validator'

export class CreatePtoRequestDto {
  @ApiProperty({ default: 'Vacation' })
  @IsString()
  readonly name: string
}
