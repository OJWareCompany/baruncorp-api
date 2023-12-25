import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class FindPositionUnRegisteredUsersRequestDto {
  @ApiProperty({ default: '8d636d48-3a86-4121-bb19-bce0991a862e' })
  @IsString()
  readonly positionId: string
}
