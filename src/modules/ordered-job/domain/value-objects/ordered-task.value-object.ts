import { ApiProperty } from '@nestjs/swagger'

export class NewOrderedTasks {
  taskId: string
  description: string | null
  constructor(props: NewOrderedTasks) {
    this.taskId = props.taskId
    this.description = props.description
  }
}

export class OrderedTask {
  @ApiProperty()
  id: string
  @ApiProperty()
  isNewTask: boolean
  @ApiProperty()
  isLocked: boolean
  @ApiProperty()
  taskStatus: string
  @ApiProperty()
  taskName: string
  @ApiProperty()
  taskId: string
  @ApiProperty()
  jobId: string
  @ApiProperty()
  projectId: string
  @ApiProperty()
  dateCreated: Date
  @ApiProperty()
  assigneeName: string | null
  @ApiProperty()
  assigneeUserId: string | null
  @ApiProperty()
  description: string | null
  constructor(props: OrderedTask) {
    this.id = props.id
    this.isNewTask = props.isNewTask
    this.isLocked = props.isLocked
    this.taskStatus = props.taskStatus
    this.taskName = props.taskName
    this.taskId = props.taskId
    this.jobId = props.jobId
    this.projectId = props.projectId
    this.dateCreated = props.dateCreated
    this.assigneeName = props.assigneeName
    this.description = props.description
  }
}

// interface OrderedTaskProps {
//   isNewTask?: boolean
//   isLocked?: boolean
//   taskStatus?: string
//   taskName?: string
//   taskId?: string
//   jobId?: string
//   projectId?: string
//   dateCreated?: Date
//   assignedTo?: string | null
//   description?: string | null
// }
