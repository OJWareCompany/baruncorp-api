import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class DeleteAvailableTaskRequestParamDto {
  @ApiProperty({ default: '07ec8e89-6877-4fa1-a029-c58360b57f43' })
  @IsString()
  readonly userId: string

  @ApiProperty({ default: 'b2ccaea3-20c2-4563-9025-9571c7e9776d' })
  @IsString()
  readonly taskId: string
}
