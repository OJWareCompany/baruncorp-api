import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class DeletePositionWorkerParamRequestDto {
  @ApiProperty({ default: '8d636d48-3a86-4121-bb19-bce0991a862e' })
  @IsString()
  readonly positionId: string

  @ApiProperty({ default: '07ec8e89-6877-4fa1-a029-c58360b57f43' })
  @IsString()
  readonly userId: string
}
