import { Address } from '../../organization/domain/value-objects/address.vo'
import { ClientInformation } from './value-objects/client-information.value-object'
import { OrderedService } from './value-objects/ordered-service.value-object'
import { AssignedTask, NewOrderedServices } from './value-objects/assigned-task.value-object'

export enum JobStatusEnum {
  Not_Started = 'Not Started',
  In_Progress = 'In Progress',
  On_Hold = 'On Hold',
  Completed = 'Completed',
  Canceled = 'Canceled',
}
export type JobStatus = 'Not Started' | 'In Progress' | 'On Hold' | 'Completed' | 'Canceled'

/**
 * 인자로 받지 않아도 만들수 있는 필드는 제외한다.
 * JobProps에 포함되지 않는 필드나 변형된 필드 제거할것
 */
export interface CreateJobProps {
  projectId: string
  mountingType: string
  propertyFullAddress: string
  totalOfJobs: number
  deliverablesEmails: string[]
  orderedServices: NewOrderedServices[]
  systemSize: number | null
  mailingAddressForWetStamp: Address | null
  numberOfWetStamp: number | null
  additionalInformationFromClient: string | null
  clientInfo: ClientInformation
  projectType: string // Type이나 Enum으로 수정하기
  isExpedited: boolean
  updatedBy: string
}

export interface JobProps extends Omit<CreateJobProps, 'totalOfJobs'> {
  invoiceId: string | null
  jobName: string
  jobStatus: JobStatus // 인자로 받지 않고 내부에서 값을 생성하는 필드
  jobRequestNumber: number
  assignedTasks: AssignedTask[]
  orderedServices: OrderedService[]
  receivedAt: Date
  isCurrentJob?: boolean
  // project?: OrderedProjects | null
}
