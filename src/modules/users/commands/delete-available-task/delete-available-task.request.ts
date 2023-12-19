import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class DeleteAvailableTaskRequestParamDto {
  @ApiProperty()
  @IsString()
  readonly userId: string

  @ApiProperty()
  @IsString()
  readonly taskId: string
}
