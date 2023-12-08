import { MountingTypeEnum, ProjectPropertyTypeEnum } from '../../project/domain/project.type'

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
  taskName: string
  orderedServiceId: string
  serviceName: string
  projectId: string
  jobId: string
  assigneeId: string | null
  assigneeName: string | null
  organizationId: string
  organizationName: string
  projectPropertyType: ProjectPropertyTypeEnum
  mountingType: MountingTypeEnum
  description: string | null
}

export interface AssignedTaskProps extends CreateAssignedTaskProps {
  status: AssignedTaskStatus
  duration: number | null
  startedAt: Date | null
  doneAt: Date | null
}
