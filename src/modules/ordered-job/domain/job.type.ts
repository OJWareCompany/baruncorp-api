import { Address } from '../../organization/domain/value-objects/address.vo'
import { ClientInformation } from './value-objects/client-information.value-object'
import { OrderedService } from './value-objects/ordered-service.value-object'
import { AssignedTask, NewOrderedServices } from './value-objects/assigned-task.value-object'
import { OrderedServiceSizeForRevisionEnum } from '../../ordered-service/domain/ordered-service.type'
import { PricingTypeEnum } from '../../invoice/dtos/invoice.response.dto'
import { MountingTypeEnum, ProjectPropertyTypeEnum } from '../../project/domain/project.type'

export enum OrderedJobsPriorityEnum {
  Immediate = 'Immediate',
  High = 'High',
  Medium = 'Medium',
  Low = 'Low',
}

export enum JobStatusEnum {
  Not_Started = 'Not Started',
  In_Progress = 'In Progress',
  On_Hold = 'On Hold',
  Canceled = 'Canceled',
  Completed = 'Completed',
  Canceled_Invoice = 'Canceled (Invoice)',
}

export enum AutoOnlyJobStatusEnum {
  Sent_To_Client = 'Sent To Client',
}

export type JobStatus = JobStatusEnum | AutoOnlyJobStatusEnum

export enum LoadCalcOriginEnum {
  Self = 'Self',
  ClientProvided = 'Client Provided',
}

/**
 * 인자로 받지 않아도 만들수 있는 필드는 제외한다.
 * JobProps에 포함되지 않는 필드나 변형된 필드 제거할것
 */
export interface CreateJobProps {
  organizationId: string
  organizationName: string

  projectId: string
  projectNumber: string | null
  propertyFullAddress: string
  projectPropertyType: ProjectPropertyTypeEnum
  propertyOwner: string | null
  totalOfJobs: number
  structuralUpgradeNote: string | null

  deliverablesEmails: string[]
  mailingAddressForWetStamp: Address | null
  updatedBy: string
  editorUserId: string | null
  clientInfo: ClientInformation
  additionalInformationFromClient: string | null

  /**
   * 주문 수정, 주문 수정 이력 생성
   * 서비스 가격 수정됨 -> 서비스 수정 이력 생성
   *
   */
  // 수정하게 되면 주문 품목, 태스크의 상태까지 변경될 수 있는 필드들
  mountingType: MountingTypeEnum // 가격이 수정됨
  systemSize: number | null // 가격이 수정됨
  isExpedited: boolean
  loadCalcOrigin: LoadCalcOriginEnum

  // 서비스나 태스크의 추가/수정에 영향받는 필드들
  dueDate: Date | null

  numberOfWetStamp: number | null
  orderedServices: NewOrderedServices[]
}

export interface JobProps extends Omit<CreateJobProps, 'totalOfJobs'> {
  jobName: string
  jobRequestNumber: number
  receivedAt: Date
  isCurrentJob?: boolean
  dateSentToClient: Date | null
  isManualDueDate: boolean
  completedCancelledDate: Date | null

  // 인보이스에 영향받는 필드들
  invoiceId: string | null

  // 서비스나 태스크의 추가/수정에 영향받는 필드들
  jobStatus: JobStatus // 인자로 받지 않고 내부에서 값을 생성하는 필드
  pricingType: PricingTypeEnum | null
  revisionSize: OrderedServiceSizeForRevisionEnum | null

  orderedServices: OrderedService[]
  assignedTasks: AssignedTask[]
  priority: OrderedJobsPriorityEnum
  inReview: boolean
}
