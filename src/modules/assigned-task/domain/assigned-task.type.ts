export type AssignedTaskStatus = 'Not Started' | 'In Progress' | 'On Hold' | 'Canceled' | 'Completed'

export enum AssignedTaskStatusEnum {
  Not_Started = 'Not Started',
  In_Progress = 'In Progress',
  On_Hold = 'On Hold',
  Canceled = 'Canceled',
  Completed = 'Completed',
}

export interface CreateAssignedTaskProps {
  taskId: string
  orderedServiceId: string
  jobId: string
  assigneeId: string | null
}

export interface AssignedTaskProps extends CreateAssignedTaskProps {
  status: AssignedTaskStatus
  startedAt: Date | null
  doneAt: Date | null
}
