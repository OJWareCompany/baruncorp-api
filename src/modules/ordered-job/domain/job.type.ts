import { Address } from '../../organization/domain/value-objects/address.vo'
import { ClientInformation } from './value-objects/client-information.value-object'
import { OrderedService } from './value-objects/ordered-service.value-object'
import { AssignedTask, NewOrderedServices } from './value-objects/assigned-task.value-object'
import { OrderedServiceSizeForRevisionEnum } from '../../ordered-service/domain/ordered-service.type'
import { PricingTypeEnum } from '../../invoice/dtos/invoice.response.dto'
import { MountingTypeEnum, ProjectPropertyTypeEnum } from '../../project/domain/project.type'

export enum JobStatusEnum {
  Not_Started = 'Not Started',
  In_Progress = 'In Progress',
  On_Hold = 'On Hold',
  Canceled = 'Canceled',
  Completed = 'Completed',
  Sent_To_Client = 'Sent To Client',
}

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
  mountingType: MountingTypeEnum
  propertyFullAddress: string
  totalOfJobs: number
  deliverablesEmails: string[]
  orderedServices: NewOrderedServices[]
  systemSize: number | null
  mailingAddressForWetStamp: Address | null
  numberOfWetStamp: number | null
  additionalInformationFromClient: string | null
  clientInfo: ClientInformation
  projectPropertyType: ProjectPropertyTypeEnum
  loadCalcOrigin: LoadCalcOriginEnum
  isExpedited: boolean
  updatedBy: string
}

export interface JobProps extends Omit<CreateJobProps, 'totalOfJobs'> {
  invoiceId: string | null
  jobName: string
  jobStatus: JobStatusEnum // 인자로 받지 않고 내부에서 값을 생성하는 필드
  jobRequestNumber: number
  assignedTasks: AssignedTask[]
  orderedServices: OrderedService[]
  receivedAt: Date
  isCurrentJob?: boolean
  revisionSize: OrderedServiceSizeForRevisionEnum | null
  pricingType: PricingTypeEnum | null
  // project?: OrderedProjects | null
}
