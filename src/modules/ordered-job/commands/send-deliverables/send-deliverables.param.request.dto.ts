import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class SendDeliverablesParamRequestDto {
  @ApiProperty({ default: 'a3c7e040-44ff-48c3-bbb8-9fb53024ba73' })
  @IsString()
  readonly jobId: string
}

export class SendDeliverablesRequestDto {
  // readonly deliverablesLink: string
}
