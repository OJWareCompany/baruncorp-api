import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsString } from 'class-validator'

export class UpdatePositionParamRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly positionId: string
}

export class UpdatePositionRequestDto {
  @ApiProperty({ default: 'Sr. Designer Update Test' })
  @IsString()
  readonly name: string

  @ApiProperty({ default: 777 })
  @IsNumber()
  readonly maxAssignedTasksLimit: number | null

  @ApiProperty({ default: null })
  @IsString()
  @IsOptional()
  readonly description?: string | null
}
