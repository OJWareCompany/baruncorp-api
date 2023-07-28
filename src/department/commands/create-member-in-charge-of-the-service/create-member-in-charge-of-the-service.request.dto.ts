import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CreateMemberInChargeOfTheServiceRequestDto {
  @ApiProperty({ default: '96d39061-a4d7-4de9-a147-f627467e11d5' })
  @IsString()
  readonly userId: string

  @ApiProperty({ default: 'a061c441-be8c-4bcc-9bcc-2460a01d5a16' })
  @IsString()
  readonly serviceId: string
}
