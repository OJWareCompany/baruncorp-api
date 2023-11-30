import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsString } from 'class-validator'
import { initialize } from '../../../libs/utils/constructor-initializer'
import { AssignedTasks } from '@prisma/client'
import { AssignedTaskStatusEnum } from '../domain/assigned-task.type'

export class AssignedTaskResponseDto implements AssignedTasks {
  @ApiProperty()
  @IsString()
  readonly id: string

  @ApiProperty()
  @IsString()
  readonly taskId: string

  @ApiProperty()
  @IsString()
  readonly orderedServiceId: string

  @ApiProperty()
  @IsString()
  readonly jobId: string

  @ApiProperty({ default: AssignedTaskStatusEnum.Not_Started, enum: AssignedTaskStatusEnum })
  @IsString()
  readonly status: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly description: string | null

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly assigneeId: string | null

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly assigneeName: string | null

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly startedAt: Date | null

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly doneAt: Date | null

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  readonly duration: number | null

  constructor(props: AssignedTaskResponseDto) {
    initialize(this, props)
  }
}
