import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class DeleteTaskParamRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly taskId: string
}
