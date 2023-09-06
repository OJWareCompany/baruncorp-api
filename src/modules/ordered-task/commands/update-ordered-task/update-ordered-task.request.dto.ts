import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsOptional, IsString } from 'class-validator'
import { TaskStatus, TaskStatusEnum } from '../../domain/ordered-task.type'

export class UpdateOrderedTaskRequestParam {
  @ApiProperty()
  @IsString()
  orderedTaskId: string
}

export class UpdateOrderedTaskRequestDto {
  @ApiProperty()
  @IsBoolean()
  isLocked: boolean

  @ApiProperty({ enum: TaskStatusEnum, default: TaskStatusEnum.In_Progress })
  @IsString()
  taskStatus: TaskStatus

  @ApiProperty()
  @IsString()
  @IsOptional()
  assigneeUserId: string | null

  @ApiProperty({ default: 'dubidubob' })
  @IsString()
  @IsOptional()
  description: string | null
}
