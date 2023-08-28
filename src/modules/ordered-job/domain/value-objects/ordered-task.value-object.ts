export class OrderedTasksWhenToCreateJob {
  taskId?: string
  description?: string | null
  constructor(props: OrderedTasksWhenToCreateJob) {
    this.taskId = props.taskId
    this.description = props.description
  }
}

export class OrderedTask {
  id: string
  isNewTask: boolean
  isLocked: boolean
  taskStatus: string
  taskName: string
  taskId: string
  jobId: string
  projectId: string
  dateCreated: Date
  assignedTo: string | null
  assignedUserId: string | null
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
    this.assignedTo = props.assignedTo
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
