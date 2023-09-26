import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class UpdateTaskRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly taskId: string
}
