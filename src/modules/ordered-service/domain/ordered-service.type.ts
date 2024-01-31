import { AssignedTasks } from '@prisma/client'
import { MountingTypeEnum, ProjectPropertyTypeEnum } from '../../project/domain/project.type'

export enum OrderedServiceStatusEnum {
  Not_Started = 'Not Started',
  In_Progress = 'In Progress',
  Canceled = 'Canceled',
  Completed = 'Completed',
  Canceled_Invoice = 'Canceled (Invoice)',
}

export enum AutoOnlyOrderedServiceStatusEnum {
  On_Hold = 'On Hold',
}

export type OrderedScopeStatus = OrderedServiceStatusEnum | AutoOnlyOrderedServiceStatusEnum

export type OrderedServiceSizeForRevision = 'Major' | 'Minor'

export enum OrderedServiceSizeForRevisionEnum {
  Major = 'Major',
  Minor = 'Minor',
}

export enum OrderedServicePricingTypeEnum {
  BASE_RESIDENTIAL_NEW_PRICE = 'Base Residential New Price',
  BASE_RESIDENTIAL_GM_PRICE = 'Base Residential GM Price',
  BASE_RESIDENTIAL_REVISION_PRICE = 'Base Residential Revision Price',
  BASE_RESIDENTIAL_REVISION_GM_PRICE = 'Base Residential Revision GM Price',
  BASE_COMMERCIAL_NEW_PRICE = 'Base Commercial New Price',
  BASE_COMMERCIAL_GM_PRICE = 'Base Commercial GM Price',
  BASE_COMMERCIAL_REVISION_PRICE = 'Base Commercial Revision Price',
  BASE_COMMERCIAL_REVISION_GM_PRICE = 'Base Commercial Revision GM Price',
  BASE_FIXED_PRICE = 'Base Fixed Price',

  CUSTOM_RESIDENTIAL_NEW_PRICE = 'Custom Residential New Price',
  CUSTOM_RESIDENTIAL_GM_PRICE = 'Custom Residential GM Price',
  CUSTOM_RESIDENTIAL_NEW_FLAT_PRICE = 'Custom Residential New Flat Price',
  CUSTOM_RESIDENTIAL_GM_FLAT_PRICE = 'Custom Residential GM Flat Price',
  CUSTOM_RESIDENTIAL_REVISION_PRICE = 'Custom Residential Revision Price',
  CUSTOM_RESIDENTIAL_REVISION_GM_PRICE = 'Custom Residential Revision GM Price',
  CUSTOM_COMMERCIAL_NEW_PRICE = 'Custom Commercial New Price',
  CUSTOM_COMMERCIAL_GM_PRICE = 'Custom Commercial GM Price',
  CUSTOM_FIXED_PRICE = 'Custom Fixed Price',

  CUSTOM_SPECIAL_REVISION_PRICE = 'Custom Special Revision Price',
  CUSTOM_SPECIAL_REVISION_FREE = 'Custom Special Revision Fee',

  NO_PRICING_TYPE = 'No Pricing Type',
}

export interface CreateOrderedServiceProps {
  serviceId: string
  serviceName: string
  isRevision: boolean
  projectId: string
  jobId: string
  description: string | null
  projectPropertyType: ProjectPropertyTypeEnum
  mountingType: MountingTypeEnum // TODO: Job의 값이 변경될때 같이 변경되어야함.
  organizationId: string
  organizationName: string
  projectNumber: string | null
  projectPropertyOwnerName: string | null
  jobName: string
  isExpedited: boolean
  updatedBy: string | null
  editorUserId: string | null
}

export interface OrderedServiceProps extends CreateOrderedServiceProps {
  price: number | null
  priceOverride: number | null
  sizeForRevision: OrderedServiceSizeForRevisionEnum | null
  orderedAt: Date
  status: OrderedScopeStatus
  doneAt: Date | null
  assignedTasks: AssignedTasks[]
  isManualPrice: boolean
}
