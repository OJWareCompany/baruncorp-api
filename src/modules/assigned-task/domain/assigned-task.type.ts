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
  serviceId: string
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
  isRevision: boolean
  projectNumber: string | null
  projectPropertyOwnerName: string
  jobName: string
}

export interface AssignedTaskProps extends CreateAssignedTaskProps {
  status: AssignedTaskStatus
  cost: number | null
  isVendor: boolean
  vendorInvoiceId: string | null
  duration: number | null
  startedAt: Date | null
  doneAt: Date | null
}
