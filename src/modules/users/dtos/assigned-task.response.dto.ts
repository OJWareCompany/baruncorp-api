import { ApiProperty } from '@nestjs/swagger'

export class RelatedTaskResponseDto {
  @ApiProperty({ default: '' })
  readonly id: string

  @ApiProperty({ default: '' })
  readonly name: string
}
