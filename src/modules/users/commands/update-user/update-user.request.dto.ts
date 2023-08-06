import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

// VO를 상속하면 안되는 이유: UserName VO라는 Type은 통과하지만, UserName에서 상속받은 method는 없다.
export class UpdateUserRequestDto {
  @ApiProperty({ default: 'updated Hyomin' })
  @IsString()
  readonly firstName: string

  @ApiProperty({ default: 'updated Kim' })
  @IsString()
  readonly lastName: string
}
