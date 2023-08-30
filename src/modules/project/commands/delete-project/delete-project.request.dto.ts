import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class DeleteProjectRequestDto {
  @ApiProperty({ default: 'e457b3d0-5ff8-4d04-b6e9-d05714f768cf' })
  @IsString()
  projectId: string
}
