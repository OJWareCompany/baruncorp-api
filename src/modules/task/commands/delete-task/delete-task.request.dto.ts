import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class DeleteTaskRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly taskId: string
}
