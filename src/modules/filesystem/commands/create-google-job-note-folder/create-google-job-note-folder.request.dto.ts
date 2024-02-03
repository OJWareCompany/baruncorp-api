import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CreateGoogleJobNoteFolderRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly id: string

  @ApiProperty({ default: '' })
  @IsString()
  readonly shareLink: string

  @ApiProperty({ default: '' })
  @IsString()
  readonly jobNotesFolderId: string

  @ApiProperty({ default: '' })
  @IsString()
  readonly jobNoteId: string

  @ApiProperty({ default: '' })
  @IsString()
  readonly sharedDriveId: string
}
