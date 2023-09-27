import { ApiProperty } from '@nestjs/swagger'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { AssignedTaskStatus } from '../../../assigned-task/domain/assigned-task.type'
import { IsOptional } from 'class-validator'

export class NewOrderedServices {
  serviceId: string
  description: string | null
  constructor(props: NewOrderedServices) {
    this.serviceId = props.serviceId
    this.description = props.description
  }
}

export class AssignedTask {
  @ApiProperty()
  assignTaskId: string

  @ApiProperty()
  status: AssignedTaskStatus

  @ApiProperty()
  taskName: string

  @ApiProperty()
  taskId: string

  @ApiProperty()
  orderedServiceId: string

  @ApiProperty()
  jobId: string

  @ApiProperty()
  @IsOptional()
  startedAt: Date | null

  @ApiProperty()
  assigneeName: string | null

  @ApiProperty()
  @IsOptional()
  assigneeId: string | null

  @ApiProperty()
  @IsOptional()
  doneAt: Date | null

  @ApiProperty()
  @IsOptional()
  description: string | null

  // @ApiProperty()
  // projectId: string

  // @ApiProperty()
  // isNewTask: boolean

  constructor(props: AssignedTask) {
    initialize(this, props)
  }
}
