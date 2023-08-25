import { ClientInformation } from './value-objects/client-information.value-object'
import { OrderedTasksValueObject } from './value-objects/ordered-tasks.value-object'

export type JobStatus = 'Not Started' | 'In Progress' | 'On Hold' | 'Complete' | 'Cancel'

/**
 * 인자로 받지 않아도 만들수 있는 필드는 제외한다.
 */
export interface CreateJobProps {
  projectId: string
  jobName: string
  orderedTasks: OrderedTasksValueObject
  systemSize: number
  mailingAddressForWetStamp: string
  numberOfWetStamp: number
  additionalInformationFromClient: string
  clientInfo: ClientInformation
  updatedBy: string
}

export interface JobProps {
  projectId: string
  jobStatus: JobStatus // 인자로 받지 않고 내부에서 값을 생성하는 필드
  jobName: string
  orderedTasks: OrderedTasksValueObject
  systemSize: number
  mailingAddressForWetStamp: string
  numberOfWetStamp: number
  additionalInformationFromClient: string
  clientInfo: ClientInformation
  updatedBy: string
  receivedAt: Date
}
