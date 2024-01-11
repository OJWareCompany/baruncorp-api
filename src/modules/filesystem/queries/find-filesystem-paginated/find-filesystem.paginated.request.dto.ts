import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class FindFilesystemPaginatedRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly filesystemId: string
}
