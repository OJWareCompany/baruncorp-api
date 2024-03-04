import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class AddUserRequestDto {
  @ApiProperty()
  @IsString()
  readonly userId: string
}

export class AddUserRequestParamDto {
  @ApiProperty()
  @IsString()
  readonly departmentId: string
}
