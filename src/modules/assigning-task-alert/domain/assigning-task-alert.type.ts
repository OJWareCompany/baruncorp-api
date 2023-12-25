import { MountingTypeEnum, ProjectPropertyTypeEnum } from '../../project/domain/project.type'

export interface CreateAssigningTaskAlertProps {
  assignedTaskId: string
  taskName: string
  userId: string
  userName: string
  jobId: string
  projectPropertyType: ProjectPropertyTypeEnum
  mountingType: MountingTypeEnum
  isRevision: boolean
  note: string | null
}

export interface AssigningTaskAlertProps extends CreateAssigningTaskAlertProps {
  isCheckedOut: boolean
}
