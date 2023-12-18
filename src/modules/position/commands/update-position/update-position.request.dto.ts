import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsString } from 'class-validator'

export class UpdatePositionParamRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly positionId: string
}

export class UpdatePositionRequestDto {
  @ApiProperty({ default: 'Sr. Designer' })
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
