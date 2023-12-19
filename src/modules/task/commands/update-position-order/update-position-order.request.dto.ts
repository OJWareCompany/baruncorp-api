import { ApiProperty } from '@nestjs/swagger'
import { IsString, ValidateNested } from 'class-validator'
import { TaskPosition } from '../../dtos/task.paginated.response.dto'

export class UpdatePositionOrderParamRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly taskId: string
}

export class UpdatePositionOrderRequestDto {
  @ApiProperty({ type: TaskPosition, isArray: true })
  @ValidateNested()
  readonly taskPositions: TaskPosition[]
}
