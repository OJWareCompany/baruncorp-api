import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class DeletePositionTaskParamRequestDto {
  @ApiProperty({ default: '8d636d48-3a86-4121-bb19-bce0991a862e' })
  @IsString()
  readonly positionId: string

  @ApiProperty({ default: '911fe9ac-94b8-4a0e-b478-56e88f4aa7d7' })
  @IsString()
  readonly taskId: string
}
