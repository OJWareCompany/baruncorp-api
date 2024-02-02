import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'

export class UpdateGoogleSharedDriveCountRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly jobFolderId: string

  @ApiProperty({ default: '' })
  @IsNumber()
  readonly count: number
}
