import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class UpdateTaskParamRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly taskId: string
}

export class UpdateTaskRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly name: string
}
