import { ApiProperty } from '@nestjs/swagger'

export class TaskResponseDto {
  @ApiProperty({ default: '' })
  readonly id: string

  @ApiProperty({ default: '' })
  readonly name: string
}
