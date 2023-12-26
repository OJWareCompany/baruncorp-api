import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsString, ValidateNested } from 'class-validator'
import { TaskPosition } from '../../dtos/task.paginated.response.dto'

export class UpdatePositionOrderParamRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly taskId: string
}

export class UpdatePositionOrderRequestDto {
  @ApiProperty({ type: TaskPosition, isArray: true })
  @IsArray()
  readonly taskPositions: TaskPosition[]
}
