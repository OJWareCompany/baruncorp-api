import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CreateGoogleAhjNoteFolderRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly geoId: string
}
