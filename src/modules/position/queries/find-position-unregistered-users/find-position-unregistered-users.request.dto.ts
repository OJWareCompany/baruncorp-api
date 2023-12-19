import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class FindPositionUnRegisteredUsersRequestDto {
  @ApiProperty({ default: 'adasdas' })
  @IsString()
  readonly positionId: string
}
