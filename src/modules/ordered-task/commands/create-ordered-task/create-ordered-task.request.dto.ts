import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CreateOrderedTaskRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  taskMenuId: string

  @ApiProperty({ default: '' })
  @IsString()
  jobId: string

  @ApiProperty({ default: '' })
  @IsString()
  assignedUserId: string | null

  @ApiProperty({ default: 'added task' })
  @IsString()
  description: string | null
}
