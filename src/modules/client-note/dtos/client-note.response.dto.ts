import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { initialize } from '../../../libs/utils/constructor-initializer'

export class ClientNoteResponseDto {
  @ApiProperty({ default: 'bd2d7904-136d-4e2e-966a-679fe4f499d0' })
  @IsString()
  readonly id: string
  constructor(props: ClientNoteResponseDto) {
    initialize(this, props)
  }
  @ApiProperty({ default: 'dglee' })
  userName: string
  @ApiProperty({ default: 'Create' })
  type: string
  @ApiProperty({ default: '2024-01-07T23:56:28.493Z' })
  updatedAt: Date
}
