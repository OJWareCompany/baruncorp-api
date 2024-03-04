import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class RemoveUserRequestParamDto {
  @ApiProperty()
  @IsString()
  readonly departmentId: string
}

export class RemoveUserRequestDto {
  @ApiProperty()
  @IsString()
  readonly userId: string
}
