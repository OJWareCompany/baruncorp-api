import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class ResetDefaultTasksRequestParamDto {
  @ApiProperty({ default: '07ec8e89-6877-4fa1-a029-c58360b57f43' })
  @IsString()
  readonly userId: string
}
