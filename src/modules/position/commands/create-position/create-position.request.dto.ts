import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsString } from 'class-validator'

export class CreatePositionRequestDto {
  @ApiProperty({ default: 'Sr. Designer Test' })
  @IsString()
  readonly name: string

  @ApiProperty({ default: 5 })
  @IsNumber()
  readonly maxAssignedTasksLimit: number | null

  @ApiProperty({ default: null })
  @IsString()
  @IsOptional()
  readonly description?: string | null
}
