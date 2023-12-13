import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator'

// VO를 상속하면 안되는 이유: UserName VO라는 Type은 통과하지만, UserName에서 상속받은 method는 없다.
export class UpdateUserRequestDto {
  @ApiProperty({ default: 'updated Hyomin' })
  @IsString()
  readonly firstName: string

  @ApiProperty({ default: 'updated Kim' })
  @IsString()
  readonly lastName: string

  @ApiProperty({ default: true })
  @IsBoolean()
  readonly isVendor: boolean

  @ApiProperty({ default: 'hyomin@ojware.com', type: String, isArray: true })
  @IsArray()
  readonly deliverablesEmails: string[]

  @ApiProperty({ default: '857-250-4567' })
  @IsString()
  @IsOptional()
  readonly phoneNumber: string | null
}
