import { ClientInformation } from './value-objects/client-information.value-object'
import { OrderedTask, OrderedTasksWhenToCreateJob } from './value-objects/ordered-task.value-object'

export type JobStatus = 'Not Started' | 'In Progress' | 'On Hold' | 'Complete' | 'Cancel'

/**
 * 인자로 받지 않아도 만들수 있는 필드는 제외한다.
 */
export interface CreateJobProps {
  projectId: string
  projectType: string
  jobName: string
  jobNumber: string
  orderedTasks: OrderedTasksWhenToCreateJob[]
  systemSize: number
  mailingAddressForWetStamp: string
  numberOfWetStamp: number
  additionalInformationFromClient: string
  clientInfo: ClientInformation
  updatedBy: string
}

export interface JobProps {
  projectId: string
  projectType: string
  jobNumber: string
  jobStatus: JobStatus // 인자로 받지 않고 내부에서 값을 생성하는 필드
  jobName: string
  orderedTasks: OrderedTask[]
  systemSize: number
  mailingAddressForWetStamp: string
  numberOfWetStamp: number
  additionalInformationFromClient: string
  clientInfo: ClientInformation
  updatedBy: string
  receivedAt: Date
  isCurrentJob?: boolean
}
