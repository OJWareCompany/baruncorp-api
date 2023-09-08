import { ClientInformation } from './value-objects/client-information.value-object'
import { OrderedTask, NewOrderedTasks } from './value-objects/ordered-task.value-object'

export enum JobStatusEnum {
  Not_Started = 'Not Started',
  In_Progress = 'In Progress',
  On_Hold = 'On Hold',
  Completed = 'Completed',
  Canceled = 'Cancel',
}
export type JobStatus = 'Not Started' | 'In Progress' | 'On Hold' | 'Completed' | 'Cancel'

/**
 * 인자로 받지 않아도 만들수 있는 필드는 제외한다.
 */
export interface CreateJobProps {
  projectId: string
  mountingType: string
  propertyAddress: string
  totalOfJobs: number
  orderedTasks: NewOrderedTasks[]
  systemSize: number | null
  mailingAddressForWetStamp: string | null
  numberOfWetStamp: number | null
  additionalInformationFromClient: string | null
  clientInfo: ClientInformation
  updatedBy: string
}

export interface JobProps {
  projectId: string
  mountingType: string
  jobName: string
  jobStatus: JobStatus // 인자로 받지 않고 내부에서 값을 생성하는 필드
  propertyAddress: string
  jobRequestNumber: number
  orderedTasks: OrderedTask[]
  systemSize: number | null
  mailingAddressForWetStamp: string | null
  numberOfWetStamp: number | null
  additionalInformationFromClient: string | null
  clientInfo: ClientInformation
  updatedBy: string
  receivedAt: Date
  isCurrentJob?: boolean
}
