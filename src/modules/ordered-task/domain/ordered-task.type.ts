export enum TaskStatusEnum {
  Not_Started = 'Not Started',
  In_Progress = 'In Progress',
  On_Hold = 'On Hold',
  Completed = 'Completed',
  Canceled = 'Canceled',
}

export type TaskStatus = 'Not Started' | 'In Progress' | 'On Hold' | 'Completed' | 'Canceled'

export interface CreateOrderedTaskProps {
  invoiceAmount: number | null
  isNewTask: boolean
  taskName: string
  taskMenuId: string
  jobId: string
  projectId: string
  assigneeName: string | null
  assigneeUserId: string | null
  description: string | null
}

export interface OrderedTaskProps {
  invoiceAmount: number | null
  isNewTask: boolean
  isLocked: boolean
  taskStatus: TaskStatus
  taskName: string
  taskMenuId: string
  jobId: string
  projectId: string
  dateCreated: Date
  assigneeName: string | null
  assigneeUserId: string | null
  description: string | null
}
