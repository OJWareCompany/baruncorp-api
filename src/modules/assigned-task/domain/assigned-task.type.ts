import { Priority } from '../../ordered-job/domain/value-objects/priority.value-object'
import { MountingTypeEnum, ProjectPropertyTypeEnum } from '../../project/domain/project.type'

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
  organizationId: string
  organizationName: string
  projectPropertyType: ProjectPropertyTypeEnum
  mountingType: MountingTypeEnum
  description: string | null
  isRevision: boolean
  projectNumber: string | null
  projectPropertyOwnerName: string | null
  jobName: string
  isExpedited: boolean
  updatedBy: string | null
  editorUserId: string | null
  priority: Priority
}

export interface AssignedTaskProps extends CreateAssignedTaskProps {
  status: AssignedTaskStatusEnum
  cost: number | null
  isManualCost: boolean
  isVendor: boolean
  assigneeId: string | null
  assigneeName: string | null
  assigneeOrganizationId: string | null
  assigneeOrganizationName: string | null
  vendorInvoiceId: string | null
  duration: number | null
  startedAt: Date | null
  doneAt: Date | null
  isActive: boolean
}
