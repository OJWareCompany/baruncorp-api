/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface SignInRequestDto {
  /** @default "admin-test@baruncorp.com" */
  email: string
  /** @default "WkdWkdaos123!" */
  password: string
}

export interface TokenResponseDto {
  accessToken: string
  refreshToken: string
}

export interface AccessTokenResponseDto {
  accessToken: string
}

export interface SignUpRequestDto {
  /** @default "hyomin@ojware.com" */
  email: string
  /** @default "Emma" */
  firstName: string
  /** @default "Smith" */
  lastName: string
  /** @default "hyomin@ojware.com" */
  deliverablesEmails: string[]
  /** @default "thisistestPass123!" */
  password: string
  /** @default "857-250-4567" */
  phoneNumber: string | null
}

export interface UserPositionResponseDto {
  id: string
  name: string
}

export interface AvailableTaskResponseDto {
  /** @default "" */
  id: string
  /** @default "" */
  name: string
  /** @default "Residential / Commercial" */
  autoAssignmentType: 'None' | 'Residential' | 'Commercial' | 'Residential / Commercial'
  /** @default "Structural" */
  licenseType: 'Structural' | 'Electrical' | null
}

export interface UserLicenseResponseDto {
  type: 'Structural' | 'Electrical'
  ownerName: string
  issuingCountryName: string
  abbreviation: string
  expiryDate: string | null
}

export interface UserResponseDto {
  id: string
  email: string
  firstName: string
  lastName: string
  fullName: string
  phoneNumber: string | null
  organization: string
  organizationId: string
  position: UserPositionResponseDto | null
  availableTasks: AvailableTaskResponseDto[]
  licenses: UserLicenseResponseDto[]
  role: string
  deliverablesEmails: string[]
  isVendor: boolean
  /** @default "Active" */
  status: 'Invitation Not Sent' | 'Invitation Sent' | 'Inactive' | 'Active'
  /** @format date-time */
  dateOfJoining: string | null
}

export interface UpdateUserRequestDto {
  /** @default "updated Hyomin" */
  firstName: string
  /** @default "updated Kim" */
  lastName: string
  /** @default true */
  isVendor: boolean
  /** @default "hyomin@ojware.com" */
  deliverablesEmails: string[]
  /** @default "857-250-4567" */
  phoneNumber: string | null
  /**
   * @format date-time
   * @default "2023-09-04"
   */
  dateOfJoining: string | null
}

export interface RoleResponseDto {
  name: string
}

export interface GiveRoleRequestDto {
  /** @default "96d39061-a4d7-4de9-a147-f627467e11d5" */
  userId: string
}

export interface CreateUserRequestDto {
  /** @default "07e12e89-6077-4fd1-a029-c50060b57f43" */
  organizationId: string
  /** @default "Emma" */
  firstName: string
  /** @default "Smith" */
  lastName: string
  /** @default "hyomin@ojware.com" */
  email: string
  /** @default true */
  isVendor: boolean
  /** @default "hyomin@ojware.com" */
  deliverablesEmails: string[]
  /** @default "857-250-4567" */
  phoneNumber: string | null
  /**
   * @format date-time
   * @default "2023-09-04"
   */
  dateOfJoining?: string | null
  /**
   * @min 1
   * @max 100
   * @default 1
   */
  tenure?: number
  /**
   * @min 1
   * @max 50
   * @default 10
   */
  totalPtoDays?: number
}

export interface IdResponse {
  /** @example "2cdc8ab1-6d50-49cc-ba14-54e4ac7ec231" */
  id: string
}

export interface UserPaginatedResponseDto {
  /** @default 1 */
  page: number
  /** @default 20 */
  pageSize: number
  /** @example 10000 */
  totalCount: number
  /** @example 500 */
  totalPage: number
  items: UserResponseDto[]
}

export interface AppointUserLicenseRequestDto {
  /** @default "96d39061-a4d7-4de9-a147-f627467e11d5" */
  userId: string
  /** @default "Structural" */
  type: 'Structural' | 'Electrical'
  /**
   * @format date-time
   * @default "2023-09-04T07:31:27.217Z"
   */
  expiryDate: string | null
}

export interface AddAvailableTaskRequestDto {
  /** @default "b2ccaea3-20c2-4563-9025-9571c7e9776d" */
  taskId: string
  /** @default "Residential" */
  autoAssignmentType: 'None' | 'Residential' | 'Commercial' | 'Residential / Commercial'
}

export interface ModifyAssignmentTypeOfAvailableTaskRequestDto {
  /** @default "Residential" */
  autoAssignmentType: 'None' | 'Residential' | 'Commercial' | 'Residential / Commercial'
}

export interface HandsStatusResponseDto {
  status: boolean
}

export interface InviteRequestDto {
  /** @default "" */
  organizationId: string
  /** @default "hyomin@ojware.com" */
  email: string
}

export interface ChangeUserRoleRequestDto {
  /** @default "Viewer" */
  newRole: 'Special Admin' | 'Admin' | 'Member' | 'Client Company Manager' | 'Client Company Employee' | 'Viewer'
}

export interface AddressDto {
  /** @default "3480 Northwest 33rd Court" */
  street1: string
  /** @default "A101" */
  street2: string | null
  /** @default "Lauderdale Lakes" */
  city: string
  /** @default "Florida" */
  state: string
  /** @default "33309" */
  postalCode: string
  /** @default "United State" */
  country: string | null
  /** @default "3480 Northwest 33rd Court, Lauderdale Lakes, Florida 33309" */
  fullAddress: string
  /** @default [-97.87,34] */
  coordinates: number[]
}

export interface OrganizationResponseDto {
  id: string
  name: string
  description: string | null
  phoneNumber: string | null
  organizationType: string
  address: AddressDto
  projectPropertyTypeDefaultValue: string | null
  mountingTypeDefaultValue: string | null
  isSpecialRevisionPricing: boolean
  numberOfFreeRevisionCount: number | null
  isVendor: boolean
  isDelinquent: boolean
  invoiceRecipientEmail: string | null
}

export interface OrganizationPaginatedResponseFields {
  id: string
  fullAddress: string
  name: string
  description: string | null
  phoneNumber: string | null
  organizationType: string
  invoiceRecipientEmail: string | null
  projectPropertyTypeDefaultValue: string | null
  mountingTypeDefaultValue: string | null
  isSpecialRevisionPricing: boolean
  isDelinquent: boolean
  numberOfFreeRevisionCount: number | null
  isVendor: boolean
}

export interface OrganizationPaginatedResponseDto {
  /** @default 1 */
  page: number
  /** @default 20 */
  pageSize: number
  /** @example 10000 */
  totalCount: number
  /** @example 500 */
  totalPage: number
  items: OrganizationPaginatedResponseFields[]
}

export interface CreateOrganizationRequestDto {
  /** @default true */
  isVendor: boolean
  address: AddressDto
  /** @default "01012341234" */
  phoneNumber: string | null
  /** @default "OJ Tech" */
  name: string
  /** @default "test123@baruncorp.com" */
  invoiceRecipientEmail: string | null
  /** @default "Commercial" */
  projectPropertyTypeDefaultValue: 'Residential' | 'Commercial' | null
  /** @default "Roof Mount" */
  mountingTypeDefaultValue: 'Roof Mount' | 'Ground Mount' | null
  /** @default false */
  isSpecialRevisionPricing: boolean
  /** @default 2 */
  numberOfFreeRevisionCount: number | null
}

export interface UpdateOrganizationRequestDto {
  invoiceRecipientEmail: string | null
  /** @default true */
  isVendor: boolean
  /** @default true */
  isDelinquent: boolean
  address: AddressDto
  /** @default "01012341234" */
  phoneNumber: string | null
  /** @default "Commercial" */
  projectPropertyTypeDefaultValue: 'Residential' | 'Commercial' | null
  /** @default "Roof Mount" */
  mountingTypeDefaultValue: 'Roof Mount' | 'Ground Mount' | null
  /** @default false */
  isSpecialRevisionPricing: boolean
  /** @default 2 */
  numberOfFreeRevisionCount: number | null
}

export interface CreateOrderedTaskWhenJobIsCreatedRequestDto {
  serviceId: string
  description: string | null
}

export interface CreateJobRequestDto {
  /** @default ["chris@barun.com"] */
  deliverablesEmails: string[]
  /** @default "96d39061-a4d7-4de9-a147-f627467e11d5" */
  clientUserId: string
  /** @default "please, check this out." */
  additionalInformationFromClient: string | null
  /** @default 300.1 */
  systemSize: number | null
  /** @default "d6935a65-2ec5-4df0-a8b5-a4e39f124d05" */
  projectId: string
  structuralUpgradeNote: string | null
  /** @example "Ground Mount" */
  mountingType: 'Roof Mount' | 'Ground Mount'
  /** @default "Self" */
  loadCalcOrigin: 'Self' | 'Client Provided'
  /** @default [{"serviceId":"e5d81943-3fef-416d-a85b-addb8be296c0","description":""},{"serviceId":"99ff64ee-fe47-4235-a026-db197628d077","description":""},{"serviceId":"5c29f1ae-d50b-4400-a6fb-b1a2c87126e9","description":""},{"serviceId":"2a2a256b-57a5-46f5-8cfb-1855cc29238a","description":"This is not on the menu."}] */
  taskIds: CreateOrderedTaskWhenJobIsCreatedRequestDto[]
  mailingAddressForWetStamp: AddressDto | null
  /** @default 3 */
  numberOfWetStamp: number | null
  /** @default false */
  isExpedited: boolean
  /**
   * dueDate를 입력하지 않으면 태스크에 설정된 duration으로 자동 계산된다.
   * @format date-time
   * @default null
   */
  dueDate?: string | null
}

export interface UpdateJobRequestDto {
  /** @default ["chris@barun.com"] */
  deliverablesEmails: string[]
  /** @default "96d39061-a4d7-4de9-a147-f627467e11d5" */
  clientUserId: string
  /** @default "please, check this out." */
  additionalInformationFromClient: string | null
  /** @default 300.1 */
  systemSize: number | null
  structuralUpgradeNote: string | null
  /** @default "Self" */
  loadCalcOrigin: 'Self' | 'Client Provided'
  mailingAddressForWetStamp: AddressDto | null
  /** @default 3 */
  numberOfWetStamp: number | null
  /** @default false */
  isExpedited: boolean
  /**
   * dueDate를 입력하지 않으면 태스크에 설정된 duration으로 자동 계산된다.
   * @format date-time
   * @default null
   */
  dueDate: string | null
  inReview: boolean
  /** @default "Medium" */
  priority: 'Immediate' | 'High' | 'Medium' | 'Low'
}

export interface UpdateJobStatusRequestDto {
  /** @default "Completed" */
  status: 'Not Started' | 'In Progress' | 'On Hold' | 'Canceled' | 'Completed' | 'Canceled (Invoice)'
}

export interface PrerequisiteTaskVO {
  prerequisiteTaskId: string
  prerequisiteTaskName: string
}

export interface AssignedTaskResponseDto {
  id: string
  taskId: string
  taskName: string
  orderedServiceId: string
  serviceName: string
  jobId: string
  jobDescription: string | null
  /** @default "Not Started" */
  status: 'Not Started' | 'In Progress' | 'On Hold' | 'Canceled' | 'Completed'
  description: string | null
  assigneeId: string | null
  assigneeName: string | null
  assigneeOrganizationId: string | null
  assigneeOrganizationName: string | null
  projectId: string
  organizationId: string
  organizationName: string
  projectPropertyType: string
  mountingType: string
  serviceId: string
  vendorInvoiceId: string | null
  isVendor: boolean
  /** @format date-time */
  startedAt: string | null
  /** @format date-time */
  doneAt: string | null
  /** @format date-time */
  createdAt: string | null
  duration: number | null
  cost: number | null
  prerequisiteTasks: PrerequisiteTaskVO[]
}

export interface OrderedServiceResponseFields {
  orderedServiceId: string
  serviceId: string
  sizeForRevision: 'Major' | 'Minor' | null
  serviceName: string
  pricingType:
    | 'Base Residential New Price'
    | 'Base Residential GM Price'
    | 'Base Residential Revision Price'
    | 'Base Residential Revision GM Price'
    | 'Base Commercial New Price'
    | 'Base Commercial GM Price'
    | 'Base Commercial Revision Price'
    | 'Base Commercial Revision GM Price'
    | 'Base Fixed Price'
    | 'Custom Residential New Price'
    | 'Custom Residential GM Price'
    | 'Custom Residential New Flat Price'
    | 'Custom Residential GM Flat Price'
    | 'Custom Residential Revision Price'
    | 'Custom Residential Revision GM Price'
    | 'Custom Commercial New Price'
    | 'Custom Commercial GM Price'
    | 'Custom Fixed Price'
    | 'Custom Special Revision Price'
    | 'Custom Special Revision Free'
    | 'Base Minor Revision Free'
    | 'No Pricing Type'
  isRevision: boolean
  description: string | null
  price: number | null
  priceOverride: number | null
  /** @default "Completed" */
  status: 'Not Started' | 'In Progress' | 'Canceled' | 'Completed' | 'Canceled (Invoice)' | 'On Hold'
  orderedAt: string
  doneAt: string | null
}

export interface ClientInformationFields {
  /** @example "5c29f1ae-d50b-4400-a6fb-b1a2c87126e9" */
  clientOrganizationId: string
  /** @example "Barun Corp" */
  clientOrganizationName: string
  /** @example "5c29f1ae-d50b-4400-a6fb-b1a2c87126e9" */
  clientUserId: string
  /** @example "Chris Kim" */
  clientUserName: string
  /** @example "gyals0386@gmail.com" */
  contactEmail: string
  /** @example "gyals0386@gmail.com" */
  deliverablesEmails: string[]
}

export interface JobResponseDto {
  /** @example "5c29f1ae-d50b-4400-a6fb-b1a2c87126e9" */
  id: string
  /** @example "5c29f1ae-d50b-4400-a6fb-b1a2c87126e9" */
  projectId: string
  isContainsRevisionTask: boolean
  projectPropertyType: 'Residential' | 'Commercial'
  billingCodes: string[]
  revisionSize: 'Major' | 'Minor' | null
  eeChangeScope: 'Major' | 'Minor' | null
  structuralRevisionScope: 'Major' | 'Minor' | null
  designRevisionScope: 'Major' | 'Minor' | null
  /** @example 300.1 */
  systemSize: number | null
  mailingAddressForWetStamp: AddressDto | null
  /** @example "Ground Mount" */
  mountingType: 'Roof Mount' | 'Ground Mount'
  /** @example 3 */
  numberOfWetStamp: number | null
  /** @example "Please check this out." */
  additionalInformationFromClient: string | null
  /** @example "Chris Kim" */
  updatedBy: string
  /** @example "176 Morningmist Road, Naugatuck, Connecticut 06770" */
  propertyFullAddress: string
  structuralUpgradeNote: string | null
  /** @example 5 */
  jobRequestNumber: number
  /** @example "In Progress" */
  jobStatus:
    | 'Not Started'
    | 'In Progress'
    | 'On Hold'
    | 'Canceled'
    | 'Completed'
    | 'Canceled (Invoice)'
    | 'Sent To Client'
  /** @example "Self" */
  loadCalcOrigin: 'Self' | 'Client Provided'
  assignedTasks: AssignedTaskResponseDto[]
  orderedServices: OrderedServiceResponseFields[]
  clientInfo: ClientInformationFields
  /** @example "2023-08-11 09:10:31" */
  receivedAt: string
  /** @example true */
  isExpedited: boolean
  /** @example true */
  inReview: boolean
  /** @example "High" */
  priority: 'Immediate' | 'High' | 'Medium' | 'Low'
  jobName: string
  propertyOwner: string
  projectNumber: string | null
  isCurrentJob?: boolean
  /** @format date-time */
  dateSentToClient: string | null
  price: number
  taskSubtotal: number
  pricingType: 'Standard' | 'Tiered'
  state: string
  /** @format date-time */
  dueDate: string | null
  /** @format date-time */
  completedCancelledDate: string | null
  /** @example "GnpyEmUZfZ1k7e6Jsvy_fcG8r-PWCQswP" */
  jobFolderId: string | null
  /** @example "https://drive.google.com/drive/folders/Qzjm63Ja6SAezk1QT0kUcC1x7Oo3gn8WL" */
  shareLink: string | null
}

export interface JobPaginatedResponseDto {
  /** @default 1 */
  page: number
  /** @default 20 */
  pageSize: number
  /** @example 10000 */
  totalCount: number
  /** @example 500 */
  totalPage: number
  items: JobResponseDto[]
}

export interface JobToInvoiceResponseDto {
  items: JobResponseDto[]
  subtotal: number
  discount: number
  total: number
}

export interface CommercialTier {
  /** @default 0.01 */
  startingPoint: number
  /** @default 100 */
  finishingPoint: number
  /** @default 10 */
  price: number
  /** @default 10 */
  gmPrice: number
}

export interface StandardPricingRequestDtoFields {
  /** @default 10 */
  residentialPrice: number | null
  /** @default 10 */
  residentialGmPrice: number | null
  /** @default 10 */
  residentialRevisionPrice: number | null
  /** @default 10 */
  residentialRevisionGmPrice: number | null
  /** @default [{"startingPoint":0.01,"finishingPoint":100,"price":10}] */
  commercialNewServiceTiers: CommercialTier[]
  /** @default 0.167 */
  commercialRevisionCostPerUnit: number | null
  /** @default 1 */
  commercialRevisionMinutesPerUnit: number | null
}

export interface CreateServiceRequestDto {
  /** @default "PV Design" */
  name: string
  /** @default "" */
  billingCode: string
  /** @default "Standard" */
  pricingType: 'Standard' | 'Fixed'
  standardPricing: StandardPricingRequestDtoFields | null
  /** @default null */
  fixedPrice: number | null
  /**
   * @max 9
   * @default null
   */
  residentialNewEstimatedTaskDuration: number | null
  /**
   * @max 9
   * @default null
   */
  residentialRevisionEstimatedTaskDuration: number | null
  /**
   * @max 9
   * @default null
   */
  commercialNewEstimatedTaskDuration: number | null
  /**
   * @max 9
   * @default null
   */
  commercialRevisionEstimatedTaskDuration: number | null
}

export interface UpdateServiceRequestDto {
  /** @default "PV Design" */
  name: string
  /** @default "" */
  billingCode: string
  /** @default "Standard" */
  pricingType: 'Standard' | 'Fixed'
  standardPricing: StandardPricingRequestDtoFields | null
  /** @default null */
  fixedPrice: number | null
  /**
   * @max 9
   * @default null
   */
  residentialNewEstimatedTaskDuration: number | null
  /**
   * @max 9
   * @default null
   */
  residentialRevisionEstimatedTaskDuration: number | null
  /**
   * @max 9
   * @default null
   */
  commercialNewEstimatedTaskDuration: number | null
  /**
   * @max 9
   * @default null
   */
  commercialRevisionEstimatedTaskDuration: number | null
}

export interface ServiceTaskResponseDto {
  id: string
  name: string
}

export interface ServiceResponseDto {
  id: string
  name: string
  billingCode: string
  /** @default "Standard" */
  pricingType: 'Standard' | 'Fixed'
  standardPricing: StandardPricingRequestDtoFields | null
  /** @default null */
  fixedPrice: number | null
  relatedTasks: ServiceTaskResponseDto[]
  /** @default null */
  residentialNewEstimatedTaskDuration: number | null
  /** @default null */
  residentialRevisionEstimatedTaskDuration: number | null
  /** @default null */
  commercialNewEstimatedTaskDuration: number | null
  /** @default null */
  commercialRevisionEstimatedTaskDuration: number | null
}

export interface ServicePaginatedResponseDto {
  /** @default 1 */
  page: number
  /** @default 20 */
  pageSize: number
  /** @example 10000 */
  totalCount: number
  /** @example 500 */
  totalPage: number
  items: ServiceResponseDto[]
}

export interface AddressFromMapBox {
  /** @default [-97.87,34] */
  coordinates: number[]
}

export interface CreateProjectRequestDto {
  /** @default "Residential" */
  projectPropertyType: 'Residential' | 'Commercial'
  /** @default "Chris Kim" */
  projectPropertyOwner: string | null
  /** @default "07ec8e89-6877-4fa1-a029-c58360b57f43" */
  clientOrganizationId: string
  /** @default "000152" */
  projectNumber: string | null
  projectPropertyAddress: AddressDto
  /** @default "07ec8e89-6877-4fa1-a029-c58360b57f43" */
  utilityId?: string
}

export interface UpdateProjectRequestDto {
  /** @default "Residential" */
  projectPropertyType: 'Residential' | 'Commercial'
  /** @default "Chris Kim" */
  projectPropertyOwner: string | null
  /** @default "50021" */
  projectNumber: string | null
  projectPropertyAddress: AddressDto
  /** @default "07ec8e89-6877-4fa1-a029-c58360b57f43" */
  utilityId?: string
}

export interface ProjectPaginatedResponseFields {
  /** @example "96d39061-a4d7-4de9-a147-f627467e11d5" */
  projectId: string
  /** @example "96d39061-a4d7-4de9-a147-f627467e11d5" */
  organizationId: string
  /** @example "Freedom Forever" */
  organizationName: string
  /** @example "Residential" */
  propertyType: 'Residential' | 'Commercial'
  /** @example "https://host.com/projects/path" */
  projectFolderLink: string | null
  /** @example null */
  projectNumber: string | null
  /** @example "3480 Northwest 33rd Court, Lauderdale Lakes, Florida 33309" */
  propertyFullAddress: string
  /** @example "Smith Kim" */
  propertyOwnerName: string | null
  /** @example "Ground Mount" */
  mountingType: 'Roof Mount' | 'Ground Mount'
  /** @example "2023-09-05T07:14:57.270Z" */
  createdAt: string
  /** @example 1 */
  totalOfJobs: number
  /**
   * 필요한지 확인 필요
   * @example false
   */
  masterLogUpload: boolean
  /**
   * 필요한지 확인 필요
   * @example false
   */
  designOrPEStampPreviouslyDoneOnProjectOutSide: boolean
}

export interface ProjectPaginatedResponseDto {
  /** @default 1 */
  page: number
  /** @default 20 */
  pageSize: number
  /** @example 10000 */
  totalCount: number
  /** @example 500 */
  totalPage: number
  items: ProjectPaginatedResponseFields[]
}

export interface ProjectAssociatedRegulatoryBodyDto {
  /** @default "12" */
  stateId: string
  /** @default "12011" */
  countyId: string | null
  /** @default "1201191098" */
  countySubdivisionsId: string | null
  /** @default "1239525" */
  placeId: string | null
  /** @default "1239525" */
  ahjId: string
}

export interface ProjectResponseDto {
  /** @example "07e12e89-6077-4fd1-a029-c50060b57f43" */
  projectId: string
  /** @example 201 */
  systemSize: number | null
  /** @example "Kevin Brook" */
  projectPropertyOwnerName: string | null
  /** @example "Ground Mount" */
  mountingType: 'Roof Mount' | 'Ground Mount'
  /** @example "Barun Corp" */
  clientOrganization: string
  /** @example "eaefe251-0f1f-49ac-88cb-3582ec76601d" */
  clientOrganizationId: string
  /** @example "https://host.com/projects/path" */
  projectFolderLink: string | null
  propertyAddress: AddressDto
  mailingAddressForWetStamp: AddressDto | null
  /** @example 3 */
  numberOfWetStamp: number | null
  /** @example "Residential" */
  propertyType: 'Residential' | 'Commercial'
  /** @example null */
  projectNumber: string | null
  /** @example "2023-09-05T07:14:57.270Z" */
  createdAt: string
  projectAssociatedRegulatoryBody: ProjectAssociatedRegulatoryBodyDto
  /** @example 1 */
  totalOfJobs: number
  /** @example false */
  masterLogUpload: boolean
  /** @example false */
  designOrPEStampPreviouslyDoneOnProjectOutSide: boolean
  /** @example false */
  hasHistoryElectricalPEStamp: boolean
  /** @example false */
  hasHistoryStructuralPEStamp: boolean
  /** @example "eaefe251-0f1f-49ac-88cb-3582ec76601d" */
  utilityId: string | null
  /** @example [] */
  jobs: JobResponseDto[]
  /** @example "GnpyEmUZfZ1k7e6Jsvy_fcG8r-PWCQswP" */
  projectFolderId: string | null
  /** @example "https://drive.google.com/drive/folders/Qzjm63Ja6SAezk1QT0kUcC1x7Oo3gn8WL" */
  shareLink: string | null
}

export interface ProjectsCountResponseDto {
  projectsCount: number
  jobsCount: number
}

export interface AhjNoteListResponseDto {
  geoId: string
  name: string
  fullAhjName: string
  updatedBy: string
  updatedAt: string
  type: string | null
}

export interface AhjNotePaginatedResponseDto {
  /** @default 1 */
  page: number
  /** @default 20 */
  pageSize: number
  /** @example 10000 */
  totalCount: number
  /** @example 500 */
  totalPage: number
  items: AhjNoteListResponseDto[]
}

export interface General {
  /** @default "https://google.com" */
  website: string | null
  /** @default "See Notes" */
  specificFormRequired: 'No' | 'Yes' | 'See Notes' | null
  /** @default "generalNotes..." */
  generalNotes: string | null
  /** @default "2015 IBC2" */
  buildingCodes: string | null
  /** @default "See Notes" */
  structuralStampRequired: 'No' | 'Yes' | 'See Notes' | null
  /** @default "See Notes" */
  electricalStampRequired: 'No' | 'Yes' | 'See Notes' | null
  /** @default "See Notes" */
  wetStampRequired: 'No' | 'Yes' | 'See Notes' | null
  /** @default "Arcata city" */
  name: string
  /** @default "Arroyo Grande city, California" */
  fullAhjName: string
  /** @default "2023-09-04T07:31:27.217Z" */
  createdAt: string | null
  /** @default "2023-09-04T07:31:27.217Z" */
  updatedAt: string | null
  /** @default "2023-09-04T07:31:27.217Z" */
  updatedBy: string | null
  /** @default "COUNTY" */
  type: 'STATE' | 'COUNTY' | 'COUNTY SUBDIVISIONS' | 'PLACE' | null
}

export interface Design {
  /** @default "fireSetBack..." */
  fireSetBack: string | null
  /** @default "utilityNotes..." */
  utilityNotes: string | null
  /** @default "designNotes..." */
  designNotes: string | null
  /** @default "See Notes" */
  pvMeterRequired: 'No' | 'Yes' | 'See Notes' | null
  /** @default "See Notes" */
  acDisconnectRequired: 'No' | 'Yes' | 'See Notes' | null
  /** @default "See Notes" */
  centerFed120Percent: 'No' | 'Yes' | 'See Notes' | null
  /** @default "deratedAmpacity..." */
  deratedAmpacity: string | null
}

export interface Engineering {
  /** @default "See Notes" */
  iebcAccepted: 'No' | 'Yes' | 'See Notes' | null
  /** @default "See Notes" */
  structuralObservationRequired: 'No' | 'Yes' | 'See Notes' | null
  /** @default "Certified" */
  digitalSignatureType: 'Certified' | 'Signed' | null
  /** @default "See Notes" */
  windUpliftCalculationRequired: 'No' | 'Yes' | 'See Notes' | null
  /** @default "115" */
  windSpeedRiskCatFirst: string | null
  /** @default "115" */
  windSpeedRiskCatSecond: string | null
  /** @default "30" */
  snowLoadGround: string | null
  /** @default "30" */
  snowLoadFlatRoof: string | null
  /** @default "ofWetStamps..." */
  ofWetStamps: string | null
  /** @default "ANSI B (11x17 INCH)" */
  wetStampSize:
    | 'ANSI A (8.5x11 INCH)'
    | 'ANSI B (11x17 INCH)'
    | 'ANSI D (22x34 INCH)'
    | 'ARCH D (24x36 INCH)'
    | 'See Notes'
    | null
  /** @default "engineeringNotes..." */
  engineeringNotes: string | null
}

export interface ElectricalEngineering {
  /** @default "electricalNotes..." */
  electricalNotes: string | null
}

export interface AhjNoteResponseDto {
  general: General
  design: Design
  engineering: Engineering
  electricalEngineering: ElectricalEngineering
}

export interface UpdateAhjGeneral {
  /** @example "https://google.com" */
  website: string | null
  /** @example "See Notes" */
  specificFormRequired: 'No' | 'Yes' | 'See Notes' | null
  /** @example "generalNotes..." */
  generalNotes: string | null
  /** @example "buildingCodes..." */
  buildingCodes: string | null
  /** @default "See Notes" */
  structuralStampRequired: 'No' | 'Yes' | 'See Notes' | null
  /** @default "See Notes" */
  electricalStampRequired: 'No' | 'Yes' | 'See Notes' | null
  /** @default "See Notes" */
  wetStampRequired: 'No' | 'Yes' | 'See Notes' | null
}

export interface UpdateAhjNoteRequestDto {
  general: UpdateAhjGeneral
  design: Design
  engineering: Engineering
  electricalEngineering: ElectricalEngineering
}

export interface AhjNoteHistoryResponseDto {
  historyType: 'Create' | 'Modify'
  general: General
  design: Design
  engineering: Engineering
  electricalEngineering: ElectricalEngineering
  beforeModification?: AhjNoteHistoryResponseDto
}

export interface AhjNoteHistoryListResponseDto {
  geoId: string
  historyType: 'Create' | 'Modify'
  name: string
  fullAhjName: string
  updatedBy: string
  updatedAt: string
}

export interface AhjNoteHistoryPaginatedResponseDto {
  /** @default 1 */
  page: number
  /** @default 20 */
  pageSize: number
  /** @example 10000 */
  totalCount: number
  /** @example 500 */
  totalPage: number
  items: AhjNoteHistoryListResponseDto[]
}

export interface AssignTaskRequestDto {
  /** @default "295fff4a-b13f-4c42-ba30-c0f39536ee6e" */
  assigneeId: string
}

export interface AssignedTaskPaginatedResponseDto {
  /** @default 1 */
  page: number
  /** @default 20 */
  pageSize: number
  /** @example 10000 */
  totalCount: number
  /** @example 500 */
  totalPage: number
  items: AssignedTaskResponseDto[]
}

export interface AssignedTaskSummaryDoneResponseDto {
  userId: string
  organizationName: string
  userName: string
  doneAssignedTaskCount: number
  completedAssignedTaskCount: number
  canceledAssignedTaskCount: number
}

export interface AssignedTaskSummaryDonePaginatedResponseDto {
  /** @default 1 */
  page: number
  /** @default 20 */
  pageSize: number
  /** @example 10000 */
  totalCount: number
  /** @example 500 */
  totalPage: number
  items: AssignedTaskSummaryDoneResponseDto[]
}

export interface AssignedTaskSummaryDetailResponseDto {
  jobName: string
  taskName: string
  jobId: string
  status: 'Not Started' | 'In Progress' | 'On Hold' | 'Canceled' | 'Completed'
}

export interface AssignedTaskSummaryDetailPaginatedResponseDto {
  /** @default 1 */
  page: number
  /** @default 20 */
  pageSize: number
  /** @example 10000 */
  totalCount: number
  /** @example 500 */
  totalPage: number
  items: AssignedTaskSummaryDetailResponseDto[]
}

export interface AssignedTaskSummaryInProgressResponseDto {
  userId: string
  organizationName: string
  userName: string
  inProgressAssignedTaskCount: number
}

export interface AssignedTaskSummaryInProgressPaginatedResponseDto {
  /** @default 1 */
  page: number
  /** @default 20 */
  pageSize: number
  /** @example 10000 */
  totalCount: number
  /** @example 500 */
  totalPage: number
  items: AssignedTaskSummaryInProgressResponseDto[]
}

export interface CompletedTaskCountDto {
  taskId: string
  taskName: string
  count: number
}

export interface AssignedTaskSummaryTotalResponseDto {
  userId: string
  userName: string
  tasks: CompletedTaskCountDto[]
}

export interface AssignedTaskSummaryTotalPaginatedResponseDto {
  /** @default 1 */
  page: number
  /** @default 20 */
  pageSize: number
  /** @example 10000 */
  totalCount: number
  /** @example 500 */
  totalPage: number
  items: AssignedTaskSummaryTotalResponseDto[]
}

export interface UpdateTaskDurationRequestDto {
  /** @default null */
  duration: number | null
}

export interface UpdateTaskCostRequestDto {
  /** @default null */
  cost: number | null
}

export interface AvailableWorkerResponseDto {
  id: string
  name: string
  position: string | null
}

export interface RejectedTaskReasonResponseDto {
  userId: string
  userName: string
  taskName: string
  rejectedTaskId: string
  reason: string
  /** @format date-time */
  rejectedAt: string
}

export interface RejectedTaskReasonPaginatedResponseDto {
  /** @default 1 */
  page: number
  /** @default 20 */
  pageSize: number
  /** @example 10000 */
  totalCount: number
  /** @example 500 */
  totalPage: number
  items: RejectedTaskReasonResponseDto[]
}

export interface RejectAssignedTaskRequestDto {
  reason: string
}

export interface CreateExpensePricingRequestDto {
  /** @default "43e0ab61-f929-40a9-bb03-be7d6eb9de57" */
  taskId: string
  /** @default "asda" */
  organizationId: string
  /** @default "Fixed" */
  resiNewExpenseType: string
  /** @default 25 */
  resiNewValue: number
  /** @default "Fixed" */
  resiRevExpenseType: string
  /** @default 25 */
  resiRevValue: number
  /** @default "Fixed" */
  comNewExpenseType: string
  /** @default 25 */
  comNewValue: number
  /** @default "Fixed" */
  comRevExpenseType: string
  /** @default 25 */
  comRevValue: number
}

export interface UpdateExpensePricingRequestDto {
  /** @default "Fixed" */
  resiNewExpenseType: string
  /** @default 25 */
  resiNewValue: number
  /** @default "Fixed" */
  resiRevExpenseType: string
  /** @default 25 */
  resiRevValue: number
  /** @default "Fixed" */
  comNewExpenseType: string
  /** @default 25 */
  comNewValue: number
  /** @default "Fixed" */
  comRevExpenseType: string
  /** @default 25 */
  comRevValue: number
}

export interface ExpensePricingResponseDto {
  taskId: string
  organizationId: string
  taskName: string
  resiNewExpenseType: string
  resiNewValue: number
  resiRevExpenseType: string
  resiRevValue: number
  comNewExpenseType: string
  comNewValue: number
  comRevExpenseType: string
  comRevValue: number
}

export interface ExpensePricingPaginatedResponseDto {
  /** @default 1 */
  page: number
  /** @default 20 */
  pageSize: number
  /** @example 10000 */
  totalCount: number
  /** @example 500 */
  totalPage: number
  items: ExpensePricingResponseDto[]
}

export interface CreatableExpensePricingResponse {
  taskName: string
  taskId: string
}

export interface CreateInvoiceRequestDto {
  /**
   * @format date-time
   * @default "2023-10-01T05:14:33.599Z"
   */
  invoiceDate: string
  terms: 21 | 30 | 60
  notesToClient: string | null
  clientOrganizationId: string
  /**
   * @format date-time
   * @default "2023-02"
   */
  serviceMonth: string
}

export interface UpdateInvoiceRequestDto {
  /** @format date-time */
  invoiceDate: string
  terms: 21 | 30 | 60
  notesToClient: string | null
}

export interface InvoiceClientOrganization {
  id: string
  name: string
}

export interface InvoicePayments {
  id: string
  paymentName: string
  invoiceId: string
  amount: number
  paymentMethod: 'Direct' | 'Deduction'
  notes: string | null
  paymentDate: string
  canceledAt: string | null
}

export interface InvoiceResponseDto {
  id: string
  status: 'Unissued' | 'Issued' | 'Paid'
  invoiceDate: string
  terms: 21 | 30 | 60
  dueDate: string
  notesToClient: string | null
  createdAt: string
  updatedAt: string
  servicePeriodDate: string
  subtotal: number
  discount: number | null
  total: number
  clientOrganization: InvoiceClientOrganization
  lineItems: JobResponseDto[]
  payments: InvoicePayments[]
  totalOfPayment: number
  /** @format date-time */
  issuedAt: string | null
}

export interface InvoicePaginatedResponseDto {
  /** @default 1 */
  page: number
  /** @default 20 */
  pageSize: number
  /** @example 10000 */
  totalCount: number
  /** @example 500 */
  totalPage: number
  items: InvoiceResponseDto[]
}

export interface ClientToInvoice {
  id: string
  name: string
  date: string[]
}

export interface ClientToInvoiceResponseDto {
  clientToInvoices: ClientToInvoice[]
}

export interface Attachments {
  filename?: string
  content?: string
  path?: string
  contentType?: string
  encoding?: string
  raw?: string
}

export interface IssueInvoiceRequestDto {
  attachments: Attachments[]
}

export interface ClientWithOutstandingBalancesResponseDto {
  organizationId: string
  organizationName: string
  totalBalanceDue: number
}

export interface ClientWithOutstandingBalancesPaginatedResponseDto {
  /** @default 1 */
  page: number
  /** @default 20 */
  pageSize: number
  /** @example 10000 */
  totalCount: number
  /** @example 500 */
  totalPage: number
  items: ClientWithOutstandingBalancesResponseDto[]
}

export interface Tier {
  /** @default 0.01 */
  startingPoint: number
  /** @default 100 */
  finishingPoint: number | null
  /** @default 10 */
  price: number
  /** @default 10 */
  gmPrice: number
}

export interface CreateCustomPricingRequestDto {
  /** @default "" */
  serviceId: string
  /** @default "" */
  organizationId: string
  /** @default "Custom Standard" */
  customPricingType: 'Custom Standard' | 'Custom Fixed'
  /** @default "Tier" */
  residentialNewServicePricingType: 'Tier' | 'Flat' | null
  /** @default null */
  residentialNewServiceFlatPrice: number | null
  /** @default null */
  residentialNewServiceFlatGmPrice: number | null
  /** @default [{"startingPoint":1,"finishingPoint":100,"price":10,"gmPrice":12.01},{"startingPoint":101,"finishingPoint":200,"price":10,"gmPrice":12.01},{"startingPoint":201,"finishingPoint":null,"price":10,"gmPrice":12.01}] */
  residentialNewServiceTiers: Tier[]
  /** @default 10 */
  residentialRevisionPrice: number | null
  /** @default 10 */
  residentialRevisionGmPrice: number | null
  /** @default [{"startingPoint":0.01,"finishingPoint":100,"price":10,"gmPrice":12.01},{"startingPoint":100.01,"finishingPoint":200,"price":10,"gmPrice":12.01},{"startingPoint":200.01,"finishingPoint":null,"price":10,"gmPrice":12.01}] */
  commercialNewServiceTiers: Tier[]
  /** @default null */
  fixedPrice: number | null
}

export interface UpdateCustomPricingRequestDto {
  /** @default "Custom Standard" */
  customPricingType: 'Custom Standard' | 'Custom Fixed'
  /** @default "Tier" */
  residentialNewServicePricingType: 'Tier' | 'Flat' | null
  /** @default null */
  residentialNewServiceFlatPrice: number | null
  /** @default null */
  residentialNewServiceFlatGmPrice: number | null
  /** @default [{"startingPoint":1,"finishingPoint":100,"price":10,"gmPrice":12.01},{"startingPoint":101,"finishingPoint":200,"price":10,"gmPrice":12.01},{"startingPoint":201,"finishingPoint":null,"price":10,"gmPrice":12.01}] */
  residentialNewServiceTiers: Tier[]
  /** @default 10 */
  residentialRevisionPrice: number | null
  /** @default 10 */
  residentialRevisionGmPrice: number | null
  /** @default [{"startingPoint":0.01,"finishingPoint":100,"price":10,"gmPrice":12.01},{"startingPoint":100.01,"finishingPoint":200,"price":10,"gmPrice":12.01},{"startingPoint":200.01,"finishingPoint":null,"price":10,"gmPrice":12.01}] */
  commercialNewServiceTiers: Tier[]
  /** @default null */
  fixedPrice: number | null
}

export interface CustomPricingResponseDto {
  serviceId: string
  organizationId: string
  /** @default "Custom Standard" */
  customPricingType: 'Custom Standard' | 'Custom Fixed'
  /** @default "Tier" */
  residentialNewServicePricingType: 'Tier' | 'Flat' | null
  /** @default null */
  residentialNewServiceFlatPrice: number | null
  /** @default null */
  residentialNewServiceFlatGmPrice: number | null
  /** @default [{"startingPoint":1,"finishingPoint":100,"price":10,"gmPrice":12.01},{"startingPoint":101,"finishingPoint":200,"price":10,"gmPrice":12.01},{"startingPoint":201,"finishingPoint":null,"price":10,"gmPrice":12.01}] */
  residentialNewServiceTiers: Tier[]
  /** @default 10 */
  residentialRevisionPrice: number | null
  /** @default 10 */
  residentialRevisionGmPrice: number | null
  /** @default [{"startingPoint":0.01,"finishingPoint":100,"price":10,"gmPrice":12.01},{"startingPoint":100.01,"finishingPoint":200,"price":10,"gmPrice":12.01},{"startingPoint":200.01,"finishingPoint":null,"price":10,"gmPrice":12.01}] */
  commercialNewServiceTiers: Tier[]
  /** @default null */
  fixedPrice: number | null
}

export interface CustomPricingPaginatedResponseDtoFields {
  id: string
  organizationId: string
  organizationName: string
  serviceId: string
  serviceName: string
  hasResidentialNewServicePricing: boolean
  hasResidentialRevisionPricing: boolean
  hasCommercialNewServiceTier: boolean
  hasFixedPricing: boolean
}

export interface CustomPricingPaginatedResponseDto {
  /** @default 1 */
  page: number
  /** @default 20 */
  pageSize: number
  /** @example 10000 */
  totalCount: number
  /** @example 500 */
  totalPage: number
  items: CustomPricingPaginatedResponseDtoFields[]
}

export interface CreatableCustomPricingResponse {
  serviceName: string
  serviceId: string
}

export interface CreatePositionRequestDto {
  /** @default "Sr. Designer Test" */
  name: string
  /** @default 5 */
  maxAssignedTasksLimit: number | null
  /**
   * TODO: UPDATE license type (워커와 태스크가 등록된경우 변경 불가하도록)
   * @default null
   */
  licenseType: 'Structural' | 'Electrical' | null
  /** @default null */
  description?: string | null
}

export interface UpdatePositionRequestDto {
  /** @default "Sr. Designer Update Test" */
  name: string
  /** @default 777 */
  maxAssignedTasksLimit: number | null
  /** @default null */
  description?: string | null
}

export interface PositionTask {
  taskId: string
  taskName: string
  autoAssignmentType: string
}

export interface Worker {
  userId: string
  userName: string
  email: string
}

export interface PositionResponseDto {
  /** @default "" */
  id: string
  /** @default "Sr. Designer" */
  name: string
  /** @default null */
  description: string | null
  /** @default null */
  maxAssignedTasksLimit: number | null
  tasks: PositionTask[]
  licenseType: 'Structural' | 'Electrical' | null
  workers: Worker[]
}

export interface PositionPaginatedResponseFields {
  /** @default "" */
  id: string
  /** @default "Sr. Designer" */
  name: string
  /** @default null */
  description: string | null
  /** @default null */
  maxAssignedTasksLimit: number | null
  tasks: PositionTask[]
  licenseType: 'Structural' | 'Electrical' | null
}

export interface PositionPaginatedResponseDto {
  /** @default 1 */
  page: number
  /** @default 20 */
  pageSize: number
  /** @example 10000 */
  totalCount: number
  /** @example 500 */
  totalPage: number
  items: PositionPaginatedResponseFields[]
}

export interface AddPositionTaskRequestDto {
  /** @default "911fe9ac-94b8-4a0e-b478-56e88f4aa7d7" */
  taskId: string
  /** @default "Residential / Commercial" */
  autoAssignmentType: 'None' | 'Residential' | 'Commercial' | 'Residential / Commercial'
}

export interface UpdatePositionTaskAutoAssignmentTypeRequestDto {
  /** @default "Residential / Commercial" */
  autoAssignmentType: 'None' | 'Residential' | 'Commercial' | 'Residential / Commercial'
}

export interface AddPositionWorkerRequestDto {
  /** @default "07ec8e89-6877-4fa1-a029-c58360b57f43" */
  userId: string
}

export interface PositionUnregisteredUserResponseFields {
  userId: string
  userName: string
  email: string
}

export interface PositionUnregisteredUserResponseDto {
  items: PositionUnregisteredUserResponseFields[]
}

export interface CreatePtoRequestDto {
  /** @default "ebf47426-2f8d-4b7c-9ef1-81209db8e3ad" */
  userId: string
  /**
   * @min 1
   * @max 100
   * @default 1
   */
  tenure: number
  /**
   * @min 1
   * @max 50
   * @default 10
   */
  total: number
}

export interface UpdatePtoTotalRequestDto {
  /**
   * @min 1
   * @max 50
   * @default 12
   */
  total: number
}

export interface UpdatePtoPayRequestDto {
  /** @default false */
  isPaid: boolean
}

export interface CreatePtoDetailRequestDto {
  /** @default "ebf47426-2f8d-4b7c-9ef1-81209db8e3ad" */
  userId: string
  /** @default "ebf47426-2f8d-4b7c-9ef1-81209db8e3ad" */
  ptoTypeId: string
  /**
   * @min 0
   * @max 1
   * @default 1
   */
  amountPerDay: number
  /**
   * @format date-time
   * @default "2024-01-09"
   */
  startedAt: string
  /**
   * @min 1
   * @max 180
   * @default 2
   */
  days: number
}

export interface UpdatePtoDetailRequestDto {
  /**
   * @format date-time
   * @default "2024-01-09"
   */
  startedAt: string
  /**
   * @min 1
   * @max 180
   * @default 2
   */
  days: number
  /** @default "529cec06-1fb7-4284-b56f-9f31219cd099" */
  ptoTypeId: string
  /**
   * @min 0
   * @max 1
   * @default 1
   */
  amountPerDay: number
}

export interface PtoResponseDto {
  /** @default "bd2d7904-136d-4e2e-966a-679fe4f499d0" */
  id: string
  /** @default "Deo" */
  userFirstName: string
  /** @default "John" */
  userLastName: string
  /** @default "2024-01-01" */
  userDateOfJoining: string
  /** @default 3 */
  tenure: number
  /** @default 12 */
  total: number
  /** @default 5 */
  availablePto: number
  /** @default false */
  isPaid: boolean
  /** @default "2024-01-01" */
  startedAt: string
  /** @default "2024-12-30" */
  endedAt: string
}

export interface PtoPaginatedResponseDto {
  /** @default 1 */
  page: number
  /** @default 20 */
  pageSize: number
  /** @example 10000 */
  totalCount: number
  /** @example 500 */
  totalPage: number
  items: PtoResponseDto[]
}

export interface PtoDetailResponseDto {
  /** @default "bd2d7904-136d-4e2e-966a-679fe4f499d0" */
  id: string
  /** @default "Deo" */
  userFirstName: string
  /** @default "John" */
  userLastName: string
  /** @default "2024-01-07" */
  startedAt: string
  /** @default "2024-01-09" */
  endedAt: string
  /** @default 3 */
  days: number
  /** @default 1.5 */
  amount: number
  /** @default "bd2d7904-136d-4e2e-966a-679fe4f499d0" */
  ptoTypeId: string
  /** @default "Vacation" */
  ptoTypeName: string
}

export interface PtoDetailPaginatedResponseDto {
  /** @default 1 */
  page: number
  /** @default 20 */
  pageSize: number
  /** @example 10000 */
  totalCount: number
  /** @example 500 */
  totalPage: number
  items: PtoDetailResponseDto[]
}

export interface PtoTypeInfo {
  /** @default "ad2d7904-136d-4e2e-966a-679fe4f499d2" */
  ptoTypeId: string
  /** @default "Vacation" */
  ptoTypeName: string
  /** @default 10 */
  totalAmount: number
}

export interface PtoAnnualResponseDto {
  /** @default "ad2d7904-136d-4e2e-966a-679fe4f499d2" */
  userId: string
  /** @default "Deo" */
  userFirstName: string
  /** @default "John" */
  userLastName: string
  /** @default [] */
  ptoTypeInfos: PtoTypeInfo[]
  /** @default 10 */
  totalAmount: number
}

export interface PtoAnnualPaginatedResponseDto {
  /** @default 1 */
  page: number
  /** @default 20 */
  pageSize: number
  /** @example 10000 */
  totalCount: number
  /** @example 500 */
  totalPage: number
  items: PtoAnnualResponseDto[]
}

export interface PtoTypeAvailableValue {
  /** @default "1" */
  value: number
}

export interface PtoTypeResponseDto {
  /** @default "bd2d7904-136d-4e2e-966a-679fe4f499d0" */
  id: string
  /** @default "Vacation" */
  name: string
  /** @default [] */
  availableValues: PtoTypeAvailableValue[]
}

export interface PtoTypePaginatedResponseDto {
  /** @default 1 */
  page: number
  /** @default 20 */
  pageSize: number
  /** @example 10000 */
  totalCount: number
  /** @example 500 */
  totalPage: number
  items: PtoTypeResponseDto[]
}

export interface UpdatePtoTenurePolicyRequestDto {
  /**
   * @min 1
   * @max 50
   * @default 12
   */
  total?: number
}

export interface PtoTenurePolicyResponseDto {
  /** @default "bd2d7904-136d-4e2e-966a-679fe4f499d0" */
  id: string
  /** @default "3" */
  tenure: number
  /** @default "12" */
  total: number
  /**
   * @format date-time
   * @default "2024-01-07T23:56:28.493Z"
   */
  createdAt: string
  /**
   * @format date-time
   * @default "2024-01-07T23:56:28.493Z"
   */
  updatedAt: string
}

export interface PtoTenurePolicyPaginatedResponseDto {
  /** @default 1 */
  page: number
  /** @default 20 */
  pageSize: number
  /** @example 10000 */
  totalCount: number
  /** @example 500 */
  totalPage: number
  items: PtoTenurePolicyResponseDto[]
}

export interface CreateCreditTransactionRequestDto {
  amount: number
  /** @default "Reload" */
  creditTransactionType: 'Reload' | 'Deduction'
  relatedInvoiceId?: string | null
  clientOrganizationId: string
  note: string | null
}

export interface CreditTransactionResponseDto {
  id: string
  clientOrganizationId: string
  createdBy: string
  createdByUserId: string
  amount: number
  /** @default "Reload" */
  creditTransactionType: 'Reload' | 'Deduction'
  relatedInvoiceId: string | null
  /** @format date-time */
  transactionDate: string
  /** @format date-time */
  canceledAt: string | null
}

export interface CreditTransactionPaginatedResponseDto {
  /** @default 1 */
  page: number
  /** @default 20 */
  pageSize: number
  /** @example 10000 */
  totalCount: number
  /** @example 500 */
  totalPage: number
  items: CreditTransactionResponseDto[]
}

export interface CreditOrganizationTransactionResponseDto {
  clientOrganizationId: string
  creditAmount: number
}

export interface CreatePaymentRequestDto {
  invoiceId: string
  /** @default 100 */
  amount: number
  paymentMethod: 'Direct'
  notes: string | null
}

export interface PaymentResponseDto {
  id: string
  invoiceId: string
  amount: number
  paymentMethod: 'Direct'
  paymentDate: string
  notes: string | null
  canceledAt: string | null
  organizationName: string
  organizationId: string
}

export interface PaymentPaginatedResponseDto {
  /** @default 1 */
  page: number
  /** @default 20 */
  pageSize: number
  /** @example 10000 */
  totalCount: number
  /** @example 500 */
  totalPage: number
  items: PaymentResponseDto[]
}

export interface CreateOrderedServiceRequestDto {
  /** @default "" */
  serviceId: string
  /** @default "" */
  jobId: string
  /** @default "" */
  description: string | null
}

export interface UpdateOrderedServiceRequestDto {
  /** @default "" */
  description: string | null
}

export interface OrderedServiceAssignedTaskResponse {
  id: string
  taskName: string
  status: string
  assigneeId: string | null
  startedAt: string | null
  doneAt: string | null
}

export interface OrderedServiceResponseDto {
  id: string
  serviceId: string
  serviceName: string
  organizationName: string
  jobName: string
  price: number | null
  priceOverride: number | null
  jobId: string
  /** @default "Completed" */
  status: 'Not Started' | 'In Progress' | 'Canceled' | 'Completed' | 'Canceled (Invoice)' | 'On Hold'
  orderedAt: string | null
  doneAt: string | null
  isRevision: boolean
  assignedTasks: OrderedServiceAssignedTaskResponse[]
  projectPropertyType: string
  mountingType: string
}

export interface UpdateOrderedScopeStatusRequestDto {
  /** @default "In Progress" */
  status: 'Not Started' | 'In Progress' | 'Canceled' | 'Completed' | 'Canceled (Invoice)'
}

export interface UpdateManualPriceRequestDto {
  /** @default "" */
  price: number
}

export interface UpdateRevisionSizeRequestDto {
  /** @default null */
  sizeForRevision: 'Major' | 'Minor' | null
}

export interface OrderedServicePaginatedResponseDto {
  /** @default 1 */
  page: number
  /** @default 20 */
  pageSize: number
  /** @example 10000 */
  totalCount: number
  /** @example 500 */
  totalPage: number
  items: OrderedServiceResponseDto[]
}

export interface IntegratedOrderModificationHistoryResponseDto {
  jobId: string
  /** @format date-time */
  modifiedAt: string
  modifiedBy: string
  entity: string
  entityId: string
  scopeOrTaskName: string | null
  attribute: string | null
  isDateType: boolean
  operation: 'Create' | 'Update' | 'Delete'
  afterValue: string | null
  beforeValue: string | null
}

export interface IntegratedOrderModificationHistoryPaginatedResponseDto {
  /** @default 1 */
  page: number
  /** @default 20 */
  pageSize: number
  /** @example 10000 */
  totalCount: number
  /** @example 500 */
  totalPage: number
  items: IntegratedOrderModificationHistoryResponseDto[]
}

export interface CreateUtilityRequestDto {
  /** @default "Sample Utility" */
  name: string
  /** @default ["AL","AK","AZ"] */
  stateAbbreviations: string[]
  /** @default "Blah - Blah" */
  notes?: string
}

export interface UpdateUtilityRequestDto {
  /** @default "Sample Utility" */
  name?: string
  /** @default ["AL","AK","AZ"] */
  stateAbbreviations?: string[]
  /** @default "Blah - Blah" */
  notes?: string
}

export interface UtilityResponseDto {
  /** @default "bd2d7904-136d-4e2e-966a-679fe4f499d0" */
  id: string
  /** @default "Sample Utility" */
  name: string
  /** @default ["AL","AK","AZ"] */
  stateAbbreviations: string[]
  /** @default "Blah - Blah" */
  notes: string
}

export interface UtilityPaginatedResponseDto {
  /** @default 1 */
  page: number
  /** @default 20 */
  pageSize: number
  /** @example 10000 */
  totalCount: number
  /** @example 500 */
  totalPage: number
  items: UtilityResponseDto[]
}

export interface UtilityHistoryDetail {
  /** @default "Sample Utility" */
  name: string
  /** @default ["AL","AK","AZ"] */
  stateAbbreviations: string[]
  /** @default "Blah - Blah" */
  notes: string
}

export interface UtilityHistoryDetailResponseDto {
  /** @default "bd2d7904-136d-4e2e-966a-679fe4f499d0" */
  id: string
  /** @default "dglee" */
  userName: string
  /** @default "Create" */
  type: string
  /**
   * @format date-time
   * @default "2024-01-07T23:56:28.493Z"
   */
  updatedAt: string
  beforeModificationDetail: UtilityHistoryDetail | null
  afterModificationDetail: UtilityHistoryDetail
}

export interface UtilityHistoryResponseDto {
  /** @default "bd2d7904-136d-4e2e-966a-679fe4f499d0" */
  id: string
  /** @default "dglee" */
  userName: string
  /** @default "Create" */
  type: string
  /**
   * @format date-time
   * @default "2024-01-07T23:56:28.493Z"
   */
  updatedAt: string
}

export interface UtilityHistoryPaginatedResponseDto {
  /** @default 1 */
  page: number
  /** @default 20 */
  pageSize: number
  /** @example 10000 */
  totalCount: number
  /** @example 500 */
  totalPage: number
  items: UtilityHistoryResponseDto[]
}

export interface CreateJobNoteRequestDto {
  /** @default "hs8da-cdef-gh22321ask-xzcm12e3" */
  jobId: string
  /** @default "This is Job Note Content" */
  content: string
  /** @default "<div class=......>hello world</div>" */
  emailBody?: string
  /** @default "JobNote" */
  type: 'JobNote' | 'RFI'
  /** @default ["yunwoo@oj.vision","antifragilista@oj.vision"] */
  receiverEmails?: string[]
  files: File[]
}

export interface CreateJobNoteResponseDto {
  /** @default "a1918979-a454-4d83-8eb0-31195a5967c6" */
  id: string
  /** @default 1 */
  jobNoteNumber: number
  /** @default "a1918979-a454-4d83-8eb0-31195a5967c6" */
  jobNoteFolderId: string | null
}

export interface JobNoteDetailResponseDto {
  /** @default "a1918979-a454-4d83-8eb0-31195a5967c6" */
  id: string
  /** @default "JobNote" */
  type: 'JobNote' | 'RFI'
  /** @example "Chris Kim" */
  creatorName: string
  /** @example "what do you think about Jazz?" */
  content: string
  /** @default 1 */
  jobNoteNumber: number
  /** @default "yunwoo@oj.vision" */
  senderMail: string | null
  /** @default ["yunwoo@oj.vision"] */
  receiverMails: string[] | null
  /** @default ["https://drive.google.com/drive/folders/1MFhV8NTBNsPM3pvfBz6UKKTdKntXfWd7"] */
  fileShareLink: string | null
  /** @format date-time */
  createdAt: string
}

export interface JobNoteResponseDto {
  /** @default "a1918979-a454-4d83-8eb0-31195a5967c6" */
  clientOrganizationName: string
  /** @default "a1918979-a454-4d83-8eb0-31195a5967c6" */
  projectType: string
  /** @example "Chris Kim" */
  propertyAddress: string
  /** @example 1 */
  jobRequestNumber: number
  data: JobNoteDetailResponseDto[]
}

export interface CreateTaskRequestDto {
  /** @default "618d6167-0cff-4c0f-bbf6-ed7d6e14e2f1" */
  serviceId: string
  /** @default "PV Design QA/QC" */
  name: string
  /** @default "Structural" */
  licenseType: 'Structural' | 'Electrical' | null
}

export interface UpdateTaskRequestDto {
  /** @default "" */
  name: string
  /** @default "Structural" */
  licenseType: 'Structural' | 'Electrical' | null
}

export interface TaskPosition {
  positionId: string
  positionName: string
  order: number
  autoAssignmentType: 'None' | 'Residential' | 'Commercial' | 'Residential / Commercial'
}

export interface PrerequisiteTask {
  taskId: string
  taskName: string
}

export interface TaskWorker {
  userId: string
  userName: string
  email: string
  position: string | null
  organizationName: string
  organizationId: string
}

export interface TaskResponseDto {
  /** @default "" */
  id: string
  /** @default "" */
  name: string
  /** @default "" */
  serviceId: string
  /** @default "" */
  serviceName: string
  /** @default "Structural" */
  licenseType: 'Structural' | 'Electrical' | null
  taskPositions: TaskPosition[]
  prerequisiteTask: PrerequisiteTask[]
  taskWorker: TaskWorker[]
}

export interface TaskPaginatedResponseFields {
  /** @default "" */
  id: string
  /** @default "" */
  name: string
  /** @default "" */
  serviceId: string
  /** @default "" */
  serviceName: string
  /** @default "Structural" */
  licenseType: 'Structural' | 'Electrical' | null
  taskPositions: TaskPosition[]
  prerequisiteTask: PrerequisiteTask[]
}

export interface TaskPaginatedResponseDto {
  /** @default 1 */
  page: number
  /** @default 20 */
  pageSize: number
  /** @example 10000 */
  totalCount: number
  /** @example 500 */
  totalPage: number
  items: TaskPaginatedResponseFields[]
}

export interface AddPrerequisiteTaskRequestDto {
  /** @default "911fe9ac-94b8-4a0e-b478-56e88f4aa7d7" */
  prerequisiteTaskId: string
}

export interface UpdatePositionOrderRequestDto {
  taskPositions: TaskPosition[]
}

export interface UnregisteredUserForTaskResponseDto {
  userId: string
  userName: string
}

export interface UnregisteredUserForTaskPaginatedResponseDto {
  /** @default 1 */
  page: number
  /** @default 20 */
  pageSize: number
  /** @example 10000 */
  totalCount: number
  /** @example 500 */
  totalPage: number
  items: UnregisteredUserForTaskResponseDto[]
}

export interface CreateVendorInvoiceRequestDto {
  /** @default "asda" */
  organizationId: string
  /**
   * @format date-time
   * @default "2023-12-19T11:57:01.688Z"
   */
  invoiceDate: string
  /**
   * @format date-time
   * @default ""
   */
  serviceMonth: string
  /** @default "" */
  invoiceNumber: string
  terms: 21 | 30 | 60
  /** @default "" */
  note: string | null
}

export interface VendorInvoicePayment {
  id: string
  paymentName: string
  vendorInvoiceId: string
  amount: number
  paymentMethod: 'Direct' | 'Deduction'
  notes: string | null
  /** @format date-time */
  paymentDate: string
  /** @format date-time */
  canceledAt: string | null
}

export interface VendorInvoiceResponseDto {
  /** @default "" */
  id: string
  /** @default "" */
  organizationId: string
  /** @default "" */
  organizationName: string
  /** @default "" */
  daysPastDue: string | null
  /** @default "" */
  invoiceDate: string
  /** @default "Payment" */
  transactionType: string
  /** @default 100 */
  countLineItems: number
  /** @default "" */
  dueDate: string | null
  /** @default "" */
  invoiceNumber: string
  /** @default "" */
  terms: number
  /** @default "" */
  note: string | null
  /** @default "" */
  serviceMonth: string
  /** @default "" */
  subTotal: number
  /** @default "" */
  total: number
  /** @default "" */
  invoiceTotalDifference: number
  /** @default "" */
  internalTotalBalanceDue: number | null
  internalTotalPayment: number
  vendorPayments: VendorInvoicePayment[]
  /** @default "" */
  createdAt: string
  /** @default "" */
  updatedAt: string | null
}

export interface VendorInvoicePaginatedResponseDto {
  /** @default 1 */
  page: number
  /** @default 20 */
  pageSize: number
  /** @example 10000 */
  totalCount: number
  /** @example 500 */
  totalPage: number
  items: VendorInvoiceResponseDto[]
}

export interface VendorToInvoice {
  organizationId: string
  organizationName: string
  dates: string[]
}

export interface VendorToInvoiceResponseDto {
  vendorsToInvoice: VendorToInvoice[]
}

export interface VendorInvoiceLineItemResponse {
  vendorInvoiceId: string
  taskId: string
  assigneeId: string
  assigneeName: string
  assigneeOrganizationId: string
  assigneeOrganizationName: string
  clientOrganizationId: string
  clientOrganizationName: string
  taskName: string
  jobId: string
  projectId: string
  projectNumber: string | null
  jobDescription: string | null
  propertyOwnerName: string | null
  serviceName: string
  serviceId: string
  orderedServiceId: string
  serviceDescription: string | null
  taskExpenseTotal: number
  isRevision: boolean
  createdAt: string
  doneAt: string | null
}

export interface VendorInvoiceLineItemPaginatedResponseDto {
  /** @default 1 */
  page: number
  /** @default 20 */
  pageSize: number
  /** @example 10000 */
  totalCount: number
  /** @example 500 */
  totalPage: number
  items: VendorInvoiceLineItemResponse[]
}

export interface UpdateVendorInvoicedTotalRequestDto {
  /** @default 1000 */
  total: number
}

export interface UpdateVendorInvoiceRequestDto {
  /** @format date-time */
  invoiceDate: string
  /** @default 30 */
  terms: 21 | 30 | 60
  note: string | null
}

export interface CreateVendorPaymentRequestDto {
  vendorInvoiceId: string
  /** @default 100 */
  amount: number
  paymentMethod: 'Direct'
  notes: string | null
}

export interface VendorPaymentResponseDto {
  id: string
  vendorInvoiceId: string
  amount: number
  paymentMethod: 'Direct'
  paymentDate: string
  notes: string | null
  canceledAt: string | null
  organizationName: string
  organizationId: string
}

export interface VendorPaymentPaginatedResponseDto {
  /** @default 1 */
  page: number
  /** @default 20 */
  pageSize: number
  /** @example 10000 */
  totalCount: number
  /** @example 500 */
  totalPage: number
  items: VendorPaymentResponseDto[]
}

export interface CreateVendorCreditTransactionRequestDto {
  amount: number
  /** @default "Reload" */
  creditTransactionType: 'Reload' | 'Deduction'
  relatedInvoiceId?: string | null
  clientOrganizationId: string
  note: string | null
}

export interface VendorCreditTransactionResponseDto {
  id: string
  vendorOrganizationId: string
  createdBy: string
  createdByUserId: string
  amount: number
  /** @default "Reload" */
  creditTransactionType: 'Reload' | 'Deduction'
  relatedVendorInvoiceId: string | null
  /** @format date-time */
  transactionDate: string
  /** @format date-time */
  canceledAt: string | null
}

export interface VendorCreditTransactionPaginatedResponseDto {
  /** @default 1 */
  page: number
  /** @default 20 */
  pageSize: number
  /** @example 10000 */
  totalCount: number
  /** @example 500 */
  totalPage: number
  items: VendorCreditTransactionResponseDto[]
}

export interface VendorCreditOrganizationTransactionResponseDto {
  vendorOrganizationId: string
  creditAmount: number
}

export interface LicensedWorker {
  userId: string
  userName: string
  /** @default "Structural" */
  type: string
  expiryDate: string | null
  updatedAt: string
  createdAt: string
}

export interface LicenseResponseDto {
  /** @default "Structural" */
  type: 'Structural' | 'Electrical'
  /** @default "ALASKA" */
  state: string
  /** @default "AK" */
  abbreviation: string
  workers: LicensedWorker[]
}

export interface LicensePaginatedResponseDto {
  /** @default 1 */
  page: number
  /** @default 20 */
  pageSize: number
  /** @example 10000 */
  totalCount: number
  /** @example 500 */
  totalPage: number
  items: LicenseResponseDto[]
}

export interface AssigningTaskAlertResponse {
  id: string
  userId: string
  userName: string
  assignedTaskId: string
  taskName: string
  jobId: string
  projectPropertyType: 'Residential' | 'Commercial'
  mountingType: 'Roof Mount' | 'Ground Mount'
  isRevision: boolean
  note: string | null
  /** @format date-time */
  createdAt: string
  isCheckedOut: boolean
}

export interface AssigningTaskAlertPaginatedResponse {
  /** @default 1 */
  page: number
  /** @default 20 */
  pageSize: number
  /** @example 10000 */
  totalCount: number
  /** @example 500 */
  totalPage: number
  items: AssigningTaskAlertResponse[]
}

export interface CreateInformationRequestDto {
  /** @default "string contents..." */
  contents: string
}

export interface UpdateInformationRequestDto {
  /** @default "string contents..." */
  contents: string
}

export interface InformationResponseDto {
  /** @default "bd2d7904-136d-4e2e-966a-679fe4f499d0" */
  id: string
  /** @default "string contents..." */
  contents: string
  /** @default true */
  isActive: boolean
  /**
   * @format date-time
   * @default "2024-01-07T23:56:28.493Z"
   */
  createdAt: string
  /**
   * @format date-time
   * @default "2024-01-07T23:56:28.493Z"
   */
  updatedAt: string
}

export interface InformationPaginatedResponseDto {
  /** @default 1 */
  page: number
  /** @default 20 */
  pageSize: number
  /** @example 10000 */
  totalCount: number
  /** @example 500 */
  totalPage: number
  items: InformationResponseDto[]
}

export interface UpdateClientNoteRequestDto {
  /** @default "Blah - Blah" */
  designNotes: string
  /** @default "Blah - Blah" */
  electricalEngineeringNotes: string
  /** @default "Blah - Blah" */
  structuralEngineeringNotes: string
}

export interface ClientNoteDetail {
  /** @default "Blah - Blah" */
  designNotes: string
  /** @default "Blah - Blah" */
  electricalEngineeringNotes: string
  /** @default "Blah - Blah" */
  structuralEngineeringNotes: string
}

export interface ClientNoteDetailResponseDto {
  /** @default "bd2d7904-136d-4e2e-966a-679fe4f499d0" */
  id: string
  /** @default "BarunCorp" */
  organizationName: string
  /** @default "dglee" */
  userName: string
  /** @default "Create" */
  type: string
  /**
   * @format date-time
   * @default "2024-01-07T23:56:28.493Z"
   */
  updatedAt: string
  beforeModificationDetail: ClientNoteDetail | null
  afterModificationDetail: ClientNoteDetail
}

export interface ClientNoteResponseDto {
  /** @default "bd2d7904-136d-4e2e-966a-679fe4f499d0" */
  id: string
  /** @default "dglee" */
  userName: string
  /** @default "Create" */
  type: string
  /**
   * @format date-time
   * @default "2024-01-07T23:56:28.493Z"
   */
  updatedAt: string
}

export interface ClientNotePaginatedResponseDto {
  /** @default 1 */
  page: number
  /** @default 20 */
  pageSize: number
  /** @example 10000 */
  totalCount: number
  /** @example 500 */
  totalPage: number
  items: ClientNoteResponseDto[]
}

export interface CreateGoogleJobNoteFolderRequestDto {
  /** @default "" */
  id: string
  /** @default "" */
  shareLink: string
  /** @default "" */
  jobNotesFolderId: string
  /** @default "" */
  jobNoteId: string
  /** @default "" */
  sharedDriveId: string
}

export interface CreateGoogleAhjNoteFolderRequestDto {
  /** @default "" */
  geoId: string
}

export interface JobFolderPaginatedResponseFields {
  /** @example "1-1Fk8UI8sz0yh-LV1QCCZ04K40ZHJK05" */
  id: string | null
  /** @example "93b7-40db58e-d8c42-b391-1af41a7b6b63" */
  jobId: string | null
  /** @example "0AN-3RUk9PVA7ZK0JGs" */
  sharedDriveId: string | null
}

export interface JobFolderPaginatedResponseDto {
  /** @default 1 */
  page: number
  /** @default 20 */
  pageSize: number
  /** @example 10000 */
  totalCount: number
  /** @example 500 */
  totalPage: number
  items: JobFolderPaginatedResponseFields[]
}

export interface UpdateGoogleSharedDriveCountRequestDto {
  /** @default "" */
  jobFolderId: string
  /** @default "" */
  count: number
}

export interface CreateCouriersRequestDto {
  /** @default "USP" */
  name: string
  /** @default "https://www.usp.com/track?InqueryNumber1=" */
  urlParam: string
}

export interface UpdateCouriersRequestDto {
  /** @default "USP" */
  name?: string
  /** @default "https://www.usp.com/track?InqueryNumber1=" */
  urlParam?: string
}

export interface CouriersResponseDto {
  /** @default "bd2d7904-136d-4e2e-966a-679fe4f499d0" */
  id: string
  /** @default "USP" */
  name: string
  /** @default "https://www.usp.com/track?InqueryNumber1=" */
  urlParam: string
}

export interface CouriersPaginatedResponseDto {
  /** @default 1 */
  page: number
  /** @default 20 */
  pageSize: number
  /** @example 10000 */
  totalCount: number
  /** @example 500 */
  totalPage: number
  items: CouriersResponseDto[]
}

export interface CreateTrackingNumbersRequestDto {
  /** @default "b716ad65-8e06-4077-975e-4e4e0a56018f" */
  jobId: string
  /** @default "b716ad65-8e06-4077-975e-4e4e0a56018f" */
  courierId: string
  /** @default "77331858651" */
  trackingNumber: string
}

export interface UpdateTrackingNumbersRequestDto {
  /** @default "529cec06-1fb7-4284-b56f-9f31219cd099" */
  courierId?: string
  /** @default "77331858651" */
  trackingNumber?: string
}

export interface TrackingNumbersResponseDto {
  /** @default "bd2d7904-136d-4e2e-966a-679fe4f499d0" */
  id: string
  /** @default "bd2d7904-136d-4e2e-966a-679fe4f499d0" */
  jobId: string
  /** @default "Job #2 sample..." */
  jobName: string
  /** @default "bd2d7904-136d-4e2e-966a-679fe4f499d0" */
  courierId: string
  /** @default "FedEx" */
  courierName: string
  /** @default "77331858651" */
  trackingNumber: string
  /** @default "77331858651" */
  trackingNumberUri: string
  /** @default "chris.kim" */
  createdBy: string
  /**
   * @format date-time
   * @default "2024-01-07T23:56:28.493Z"
   */
  createdAt: string
}

export interface TrackingNumbersPaginatedResponseDto {
  /** @default 1 */
  page: number
  /** @default 20 */
  pageSize: number
  /** @example 10000 */
  totalCount: number
  /** @example 500 */
  totalPage: number
  items: TrackingNumbersResponseDto[]
}

export interface ScheduleDto {
  /** @default "09:00:00" */
  start: string
  /** @default "13:00:00" */
  end: string
}

export interface PutScheduleRequestDto {
  /** @default [{"start":"09:00:00","end":"13:00:00"},{"start":"14:00:00","end":"18:00:00"}] */
  schedules: ScheduleDto[]
}

export interface ScheduleResponseDto {
  /** @default "529cec06-1fb7-4284-b56f-9f31219cd099" */
  userId: string
  /** @default "John Doe" */
  name: string
  /** @default "S- PE" */
  position: string
  /** @default [{"start":"09:00:00","end":"13:00:00"},{"start":"14:00:00","end":"18:00:00"}] */
  schedules: ScheduleDto[]
}

export interface SchedulePaginatedResponseDto {
  /** @default 1 */
  page: number
  /** @default 20 */
  pageSize: number
  /** @example 10000 */
  totalCount: number
  /** @example 500 */
  totalPage: number
  items: ScheduleResponseDto[]
}

export interface AuthenticationControllerPostSignInTimeParams {
  /** @default 20 */
  jwt: number
  /** @default 40 */
  refresh: number
}

export interface FindUsersHttpControllerGetFindUsersParams {
  /** @default "hyomin@ojware.com" */
  email?: string | null
  /** @default null */
  organizationId?: string | null
  /** @default "BarunCorp" */
  organizationName?: string | null
  /**
   * Using LIKE (중간 값 검색)
   * @default null
   */
  isContractor?: boolean | null
  /**
   * Using LIKE (중간 값 검색)
   * @default null
   */
  userName?: string | null
  /** @default "Active" */
  status?: 'Invitation Not Sent' | 'Invitation Sent' | 'Inactive' | 'Active' | null
  /**
   * Specifies a limit of returned records
   * @default 20
   * @example 20
   */
  limit?: number
  /**
   * Page number
   * @default 1
   * @example 1
   */
  page?: number
}

export interface FindLicenseHttpControllerGetParams {
  /** @default "Structural" */
  type: 'Structural' | 'Electrical'
  /** @default "" */
  abbreviation: string
}

export interface RevokeUserLicenseHttpControllerPostParams {
  /** @default "Electrical" */
  type: 'Structural' | 'Electrical'
  /** @default "96d39061-a4d7-4de9-a147-f627467e11d5" */
  userId: string
  /** @default "ALASKA" */
  abbreviation: string
}

export interface FindOrganizationPaginatedHttpControllerGetOrganizationPaginatedParams {
  /** Using LIKE (중간 값 검색) */
  name?: string | null
  /** Using LIKE (중간 값 검색) */
  fullAddress?: string | null
  /** Using LIKE (중간 값 검색) */
  email?: string | null
  /** Using LIKE (중간 값 검색) */
  phoneNumber?: string | null
  organizationType?: string | null
  projectPropertyTypeDefaultValue?: string | null
  mountingTypeDefaultValue?: string | null
  invoiceRecipientEmail?: string | null
  isVendor?: boolean | null
  /**
   * Specifies a limit of returned records
   * @default 20
   * @example 20
   */
  limit?: number
  /**
   * Page number
   * @default 1
   * @example 1
   */
  page?: number
}

export interface FindMemberPaginatedHttpControllerGetParams {
  /**
   * Specifies a limit of returned records
   * @default 20
   * @example 20
   */
  limit?: number
  /**
   * Page number
   * @default 1
   * @example 1
   */
  page?: number
  organizationId: string
}

export interface FindMyMemberPaginatedHttpControllerGetParams {
  /**
   * Specifies a limit of returned records
   * @default 20
   * @example 20
   */
  limit?: number
  /**
   * Page number
   * @default 1
   * @example 1
   */
  page?: number
}

export interface FindJobPaginatedHttpControllerFindJobParams {
  /**
   * Using LIKE (중간 값 검색)
   * @default "3480 Northwest 33rd Court"
   */
  jobName?: string | null
  /**
   * Using LIKE (중간 값 검색)
   * @default ""
   */
  projectNumber?: string | null
  /**
   * Using LIKE (중간 값 검색)
   * @default ""
   */
  propertyFullAddress?: string | null
  /** @default "Commercial" */
  projectPropertyType?: 'Residential' | 'Commercial' | null
  /** @default "Completed" */
  jobStatus?:
    | 'Not Started'
    | 'In Progress'
    | 'On Hold'
    | 'Canceled'
    | 'Completed'
    | 'Canceled (Invoice)'
    | 'Sent To Client'
    | null
  /** @default "Ground Mount" */
  mountingType?: 'Roof Mount' | 'Ground Mount' | null
  /** @default false */
  isExpedited?: boolean | null
  /** @default false */
  inReview?: boolean | null
  /** @default "Medium" */
  priority?: 'Immediate' | 'High' | 'Medium' | 'Low' | null
  /**
   * Using LIKE (중간 값 검색)
   * @default ""
   */
  propertyOwner?: string | null
  /**
   * Specifies a limit of returned records
   * @default 20
   * @example 20
   */
  limit?: number
  /**
   * Page number
   * @default 1
   * @example 1
   */
  page?: number
}

export interface FindMyJobPaginatedHttpControllerFindJobParams {
  /**
   * Using LIKE (중간 값 검색)
   * @default "3480 Northwest 33rd Court"
   */
  jobName?: string | null
  /**
   * Using LIKE (중간 값 검색)
   * @default ""
   */
  projectNumber?: string | null
  /**
   * Using LIKE (중간 값 검색)
   * @default ""
   */
  propertyFullAddress?: string | null
  /** @default "Commercial" */
  projectPropertyType?: 'Residential' | 'Commercial' | null
  /** @default "Completed" */
  jobStatus?:
    | 'Not Started'
    | 'In Progress'
    | 'On Hold'
    | 'Canceled'
    | 'Completed'
    | 'Canceled (Invoice)'
    | 'Sent To Client'
    | null
  /** @default "Ground Mount" */
  mountingType?: 'Roof Mount' | 'Ground Mount' | null
  /** @default false */
  isExpedited?: boolean | null
  /** @default false */
  inReview?: boolean | null
  /** @default "Medium" */
  priority?: 'Immediate' | 'High' | 'Medium' | 'Low' | null
  /**
   * Using LIKE (중간 값 검색)
   * @default ""
   */
  propertyOwner?: string | null
  /**
   * Specifies a limit of returned records
   * @default 20
   * @example 20
   */
  limit?: number
  /**
   * Page number
   * @default 1
   * @example 1
   */
  page?: number
}

export interface FindJobToInvoiceHttpControllerFindJobParams {
  /** @default "asda" */
  clientOrganizationId: string
  /**
   * @format date-time
   * @default "2023-06"
   */
  serviceMonth: string
}

export interface FindMyOrderedJobPaginatedHttpControllerFindJobParams {
  /**
   * Specifies a limit of returned records
   * @default 20
   * @example 20
   */
  limit?: number
  /**
   * Page number
   * @default 1
   * @example 1
   */
  page?: number
  /**
   * Using LIKE (중간 값 검색)
   * @default "3480 Northwest 33rd Court"
   */
  jobName?: string | null
  /**
   * Using LIKE (중간 값 검색)
   * @default ""
   */
  projectNumber?: string | null
  /**
   * Using LIKE (중간 값 검색)
   * @default ""
   */
  propertyFullAddress?: string | null
  /** @default "Commercial" */
  projectPropertyType?: 'Residential' | 'Commercial' | null
  /** @default "Completed" */
  jobStatus?:
    | 'Not Started'
    | 'In Progress'
    | 'On Hold'
    | 'Canceled'
    | 'Completed'
    | 'Canceled (Invoice)'
    | 'Sent To Client'
    | null
  /** @default "Ground Mount" */
  mountingType?: 'Roof Mount' | 'Ground Mount' | null
  /** @default false */
  isExpedited?: boolean | null
  /** @default false */
  inReview?: boolean | null
  /** @default "Medium" */
  priority?: 'Immediate' | 'High' | 'Medium' | 'Low' | null
  /**
   * Using LIKE (중간 값 검색)
   * @default ""
   */
  propertyOwner?: string | null
}

export interface FindServicePaginatedHttpControllerGetParams {
  /**
   * Specifies a limit of returned records
   * @default 20
   * @example 20
   */
  limit?: number
  /**
   * Page number
   * @default 1
   * @example 1
   */
  page?: number
}

export interface FindProjectsHttpControllerFindUsersParams {
  /** @default "" */
  organizationId?: string | null
  /**
   * Using LIKE (중간 값 검색)
   * @default ""
   */
  organizationName?: string | null
  /**
   * Using LIKE (중간 값 검색)
   * @default null
   */
  projectNumber?: string | null
  /**
   * Using LIKE (중간 값 검색)
   * @default null
   */
  projectPropertyOwner?: string | null
  /**
   * Using LIKE (중간 값 검색)
   * @default "3480 Northwest 33rd Court"
   */
  propertyFullAddress?: string | null
  /** @default "Residential" */
  propertyType?: 'Residential' | 'Commercial' | null
  /**
   * Specifies a limit of returned records
   * @default 20
   * @example 20
   */
  limit?: number
  /**
   * Page number
   * @default 1
   * @example 1
   */
  page?: number
}

export interface GeographyControllerGetFindNotesParams {
  /**
   * Specifies a limit of returned records
   * @default 20
   * @example 20
   */
  limit?: number
  /**
   * Page number
   * @default 1
   * @example 1
   */
  page?: number
  /** @default "1239525" */
  geoId?: string | null
  /** Using LIKE (중간 값 검색) */
  fullAhjName?: string | null
  /** Using LIKE (중간 값 검색) */
  name?: string | null
}

export interface GeographyControllerGetFinNoteUpdateHistoryDetailParams {
  /** @format date-time */
  updatedAt: string
  /** @default "1239525" */
  geoId: string
}

export interface GeographyControllerGetFindNoteUpdateHistoryParams {
  /**
   * Specifies a limit of returned records
   * @default 20
   * @example 20
   */
  limit?: number
  /**
   * Page number
   * @default 1
   * @example 1
   */
  page?: number
  /** @default "1239525" */
  geoId: string | null
}

export interface FindAssignedTaskPaginatedHttpControllerGetParams {
  /** @default "" */
  projectNumber?: string | null
  /**
   * Using LIKE (중간 값 검색)
   * @default ""
   */
  jobName?: string | null
  /**
   * Using LIKE (중간 값 검색)
   * @default ""
   */
  assigneeName?: string | null
  /**
   * Using LIKE (중간 값 검색)
   * @default ""
   */
  taskName?: string | null
  /**
   * Using LIKE (중간 값 검색)
   * @default ""
   */
  serviceName?: string | null
  /**
   * Using LIKE (중간 값 검색)
   * @default ""
   */
  organizationName?: string | null
  vendorInvoiceId?: string | null
  /** @default "Completed" */
  status?: 'Not Started' | 'In Progress' | 'On Hold' | 'Canceled' | 'Completed' | null
  /** @default "Commercial" */
  projectPropertyType?: 'Residential' | 'Commercial' | null
  /** @default "Ground Mount" */
  mountingType?: 'Roof Mount' | 'Ground Mount' | null
  /** @default false */
  isVendor?: boolean | null
  /** @default false */
  isRevision?: boolean | null
  /**
   * Specifies a limit of returned records
   * @default 20
   * @example 20
   */
  limit?: number
  /**
   * Page number
   * @default 1
   * @example 1
   */
  page?: number
}

export interface FindAssignedTaskSummaryDonePaginatedHttpControllerGetParams {
  /** @default "Barun Corp" */
  organizationName?: string
  /** @default "John Doe" */
  userName?: string
  /**
   * @format date-time
   * @default "2024-01-05"
   */
  startedAt?: string
  /**
   * @format date-time
   * @default "2025-01-06"
   */
  endedAt?: string
  /**
   * Specifies a limit of returned records
   * @default 20
   * @example 20
   */
  limit?: number
  /**
   * Page number
   * @default 1
   * @example 1
   */
  page?: number
}

export interface FindAssignedTaskSummaryDetailPaginatedHttpControllerGetParams {
  /** @default "e53b4cc2-d527-4a80-895c-a52a8c39d49d" */
  userId: string
  /** @default "Completed" */
  status?: 'Not Started' | 'In Progress' | 'On Hold' | 'Canceled' | 'Completed'
  /**
   * @format date-time
   * @default "2024-01-05"
   */
  startedAt?: string
  /**
   * @format date-time
   * @default "2025-01-06"
   */
  endedAt?: string
  /**
   * Specifies a limit of returned records
   * @default 20
   * @example 20
   */
  limit?: number
  /**
   * Page number
   * @default 1
   * @example 1
   */
  page?: number
}

export interface FindAssignedTaskSummaryInProgressPaginatedHttpControllerGetParams {
  /** @default "Barun Corp" */
  organizationName?: string
  /** @default "John Doe" */
  userName?: string
  /**
   * Specifies a limit of returned records
   * @default 20
   * @example 20
   */
  limit?: number
  /**
   * Page number
   * @default 1
   * @example 1
   */
  page?: number
}

export interface FindAssignedTaskSummaryTotalPaginatedHttpControllerGetParams {
  /**
   * @format date-time
   * @default "2024-01-05"
   */
  startedAt?: string
  /**
   * @format date-time
   * @default "2025-01-06"
   */
  endedAt?: string
  /**
   * Specifies a limit of returned records
   * @default 20
   * @example 20
   */
  limit?: number
  /**
   * Page number
   * @default 1
   * @example 1
   */
  page?: number
}

export interface FindRejectedTaskReasonHttpControllerGetParams {
  userName?: string | null
}

export interface FindExpensePricingPaginatedHttpControllerGetParams {
  taskId?: string | null
  organizationId?: string | null
  /**
   * Specifies a limit of returned records
   * @default 20
   * @example 20
   */
  limit?: number
  /**
   * Page number
   * @default 1
   * @example 1
   */
  page?: number
}

export interface FindCreatableExpensePricingHttpControllerGetParams {
  /** @default "" */
  organizationId: string
}

export interface FindInvoicePaginatedHttpControllerGetParams {
  /**
   * Specifies a limit of returned records
   * @default 20
   * @example 20
   */
  limit?: number
  /**
   * Page number
   * @default 1
   * @example 1
   */
  page?: number
  /**
   * Using LIKE (중간 값 검색)
   * @default ""
   */
  organizationName?: string | null
  /** @default "Issued" */
  status?: 'Unissued' | 'Issued' | 'Paid' | null
  /** @format date-time */
  invoiceDate?: string | null
  clientOrganizationId?: string | null
}

export interface FindClientWithOutstandingBalancesHttpControllerGetParams {
  /**
   * Specifies a limit of returned records
   * @default 20
   * @example 20
   */
  limit?: number
  /**
   * Page number
   * @default 1
   * @example 1
   */
  page?: number
}

export interface FindOverdueInvoicePaginatedHttpControllerGetParams {
  /**
   * Specifies a limit of returned records
   * @default 20
   * @example 20
   */
  limit?: number
  /**
   * Page number
   * @default 1
   * @example 1
   */
  page?: number
  /**
   * Using LIKE (중간 값 검색)
   * @default ""
   */
  organizationName?: string | null
  clientOrganizationId?: string | null
}

export interface FindCustomPricingPaginatedHttpControllerGetParams {
  /** @default "asda" */
  organizationId?: string | null
  /** @default "Barun Corp" */
  organizationName?: string | null
  /** @default "" */
  serviceId?: string | null
  /** @default "" */
  serviceName?: string | null
  /**
   * Specifies a limit of returned records
   * @default 20
   * @example 20
   */
  limit?: number
  /**
   * Page number
   * @default 1
   * @example 1
   */
  page?: number
}

export interface FindCreatableCustomPricingHttpControllerGetParams {
  /** @default "" */
  organizationId: string
}

export interface FindPositionPaginatedHttpControllerGetParams {
  /**
   * Specifies a limit of returned records
   * @default 20
   * @example 20
   */
  limit?: number
  /**
   * Page number
   * @default 1
   * @example 1
   */
  page?: number
}

export interface FindPtoPaginatedHttpControllerGetParams {
  /** @default "674e3b83-0255-46fe-bc4b-047fca3c43cf" */
  userId?: string
  /** @default "John Doe" */
  userName?: string
  /** @default false */
  isPaid?: boolean
  /**
   * Specifies a limit of returned records
   * @default 20
   * @example 20
   */
  limit?: number
  /**
   * Page number
   * @default 1
   * @example 1
   */
  page?: number
}

export interface FindPtoDetailPaginatedHttpControllerGetParams {
  /** @default "674e3b83-0255-46fe-bc4b-047fca3c43cf" */
  userId?: string
  /** @default "John Doe" */
  userName?: string
  /**
   * @format date-time
   * @default "2023-06"
   */
  targetMonth?: string
  /**
   * Specifies a limit of returned records
   * @default 20
   * @example 20
   */
  limit?: number
  /**
   * Page number
   * @default 1
   * @example 1
   */
  page?: number
}

export interface FindPtoAnnualPaginatedHttpControllerGetParams {
  /**
   * @format date-time
   * @default "2024"
   */
  targetYear: string
  /**
   * Specifies a limit of returned records
   * @default 20
   * @example 20
   */
  limit?: number
  /**
   * Page number
   * @default 1
   * @example 1
   */
  page?: number
}

export interface FindPtoTypePaginatedHttpControllerGetParams {
  /**
   * Specifies a limit of returned records
   * @default 20
   * @example 20
   */
  limit?: number
  /**
   * Page number
   * @default 1
   * @example 1
   */
  page?: number
}

export interface FindPtoTenurePolicyPaginatedHttpControllerGetParams {
  /**
   * Specifies a limit of returned records
   * @default 20
   * @example 20
   */
  limit?: number
  /**
   * Page number
   * @default 1
   * @example 1
   */
  page?: number
}

export interface FindCreditTransactionPaginatedHttpControllerGetParams {
  organizationId?: string | null
  /**
   * Specifies a limit of returned records
   * @default 20
   * @example 20
   */
  limit?: number
  /**
   * Page number
   * @default 1
   * @example 1
   */
  page?: number
}

export interface FindPaymentPaginatedHttpControllerGetParams {
  /**
   * Specifies a limit of returned records
   * @default 20
   * @example 20
   */
  limit?: number
  /**
   * Page number
   * @default 1
   * @example 1
   */
  page?: number
}

export interface FindOrderedServicePaginatedHttpControllerGetParams {
  /**
   * Specifies a limit of returned records
   * @default 20
   * @example 20
   */
  limit?: number
  /**
   * Page number
   * @default 1
   * @example 1
   */
  page?: number
  /** @default "Completed" */
  orderedServiceStatus?: 'Not Started' | 'In Progress' | 'Canceled' | 'Completed' | 'Canceled (Invoice)' | null
  /** @default "Commercial" */
  projectPropertyType?: 'Residential' | 'Commercial' | null
  /** @default "Ground Mount" */
  mountingType?: 'Roof Mount' | 'Ground Mount' | null
  /** @default false */
  isRevision?: boolean | null
  /**
   * Using LIKE (중간 값 검색)
   * @default ""
   */
  serviceName?: string | null
  /**
   * Using LIKE (중간 값 검색)
   * @default ""
   */
  organizationName?: string | null
  /**
   * Using LIKE (중간 값 검색)
   * @default ""
   */
  jobName?: string | null
}

export interface FindIntegratedOrderModificationHistoryPaginatedHttpControllerGetParams {
  jobId: string
  /**
   * Specifies a limit of returned records
   * @default 20
   * @example 20
   */
  limit?: number
  /**
   * Page number
   * @default 1
   * @example 1
   */
  page?: number
}

export interface FindUtilityPaginatedHttpControllerGetParams {
  /** @default "AL" */
  stateAbbreviation?: string
  /**
   * Specifies a limit of returned records
   * @default 20
   * @example 20
   */
  limit?: number
  /**
   * Page number
   * @default 1
   * @example 1
   */
  page?: number
}

export interface FindUtilityHistoryPaginatedHttpControllerGetParams {
  /**
   * Specifies a limit of returned records
   * @default 20
   * @example 20
   */
  limit?: number
  /**
   * Page number
   * @default 1
   * @example 1
   */
  page?: number
  /** @default "674e3b83-0255-46fe-bc4b-047fca3c43cf" */
  utilityId: string
}

export interface FindTaskPaginatedHttpControllerGetParams {
  /**
   * Specifies a limit of returned records
   * @default 20
   * @example 20
   */
  limit?: number
  /**
   * Page number
   * @default 1
   * @example 1
   */
  page?: number
}

export interface FindUnregisteredUsersForTaskHttpControllerGetParams {
  /**
   * Specifies a limit of returned records
   * @default 20
   * @example 20
   */
  limit?: number
  /**
   * Page number
   * @default 1
   * @example 1
   */
  page?: number
  taskId: string
}

export interface FindVendorInvoicePaginatedHttpControllerGetParams {
  /**
   * Using LIKE (중간 값 검색)
   * @default ""
   */
  organizationName?: string | null
  organizationId?: string | null
  /**
   * Specifies a limit of returned records
   * @default 20
   * @example 20
   */
  limit?: number
  /**
   * Page number
   * @default 1
   * @example 1
   */
  page?: number
}

export interface FindVendorToInvoiceLineItemsPaginatedHttpControllerGetParams {
  /** @default "asda" */
  clientOrganizationId: string
  /**
   * @format date-time
   * @default "2023-06"
   */
  serviceMonth: string
  /**
   * Specifies a limit of returned records
   * @default 20
   * @example 20
   */
  limit?: number
  /**
   * Page number
   * @default 1
   * @example 1
   */
  page?: number
}

export interface FindVendorInvoiceLineItemHttpControllerGetParams {
  /**
   * Specifies a limit of returned records
   * @default 20
   * @example 20
   */
  limit?: number
  /**
   * Page number
   * @default 1
   * @example 1
   */
  page?: number
  /** @default "" */
  vendorInvoiceId: string
}

export interface FindVendorPaymentPaginatedHttpControllerGetParams {
  /**
   * Specifies a limit of returned records
   * @default 20
   * @example 20
   */
  limit?: number
  /**
   * Page number
   * @default 1
   * @example 1
   */
  page?: number
}

export interface FindVendorCreditTransactionPaginatedHttpControllerGetParams {
  vendorOrganizationId?: string | null
  /**
   * Specifies a limit of returned records
   * @default 20
   * @example 20
   */
  limit?: number
  /**
   * Page number
   * @default 1
   * @example 1
   */
  page?: number
}

export interface FindLicensePaginatedHttpControllerGetParams {
  /** @default "Structural" */
  type: 'Structural' | 'Electrical'
  /**
   * Specifies a limit of returned records
   * @default 20
   * @example 20
   */
  limit?: number
  /**
   * Page number
   * @default 1
   * @example 1
   */
  page?: number
}

export interface FindAssigningTaskAlertPaginatedHttpControllerFindParams {
  /**
   * Specifies a limit of returned records
   * @default 20
   * @example 20
   */
  limit?: number
  /**
   * Page number
   * @default 1
   * @example 1
   */
  page?: number
}

export interface FindInformationPaginatedHttpControllerGetParams {
  /**
   * Specifies a limit of returned records
   * @default 20
   * @example 20
   */
  limit?: number
  /**
   * Page number
   * @default 1
   * @example 1
   */
  page?: number
}

export interface FindClientNotePaginatedHttpControllerGetParams {
  /** @default "674e3b83-0255-46fe-bc4b-047fca3c43cf" */
  organizationId?: string
  /**
   * Specifies a limit of returned records
   * @default 20
   * @example 20
   */
  limit?: number
  /**
   * Page number
   * @default 1
   * @example 1
   */
  page?: number
}

export interface FindNonCountedJobFoldersHttpControllerFindNonCountedJobFoldersParams {
  /** @format date-time */
  fromDate: string
  /** @format date-time */
  toDate: string
  /**
   * Specifies a limit of returned records
   * @default 20
   * @example 20
   */
  limit?: number
  /**
   * Page number
   * @default 1
   * @example 1
   */
  page?: number
}

export interface FindCouriersPaginatedHttpControllerGetParams {
  /**
   * Specifies a limit of returned records
   * @default 20
   * @example 20
   */
  limit?: number
  /**
   * Page number
   * @default 1
   * @example 1
   */
  page?: number
}

export interface FindTrackingNumbersPaginatedHttpControllerGetParams {
  /** @default "674e3b83-0255-46fe-bc4b-047fca3c43cf" */
  jobId?: string
  /**
   * Specifies a limit of returned records
   * @default 20
   * @example 20
   */
  limit?: number
  /**
   * Page number
   * @default 1
   * @example 1
   */
  page?: number
}

export interface FindSchedulePaginatedHttpControllerGetParams {
  /** @default "John Doe" */
  userName?: string
  /**
   * Specifies a limit of returned records
   * @default 20
   * @example 20
   */
  limit?: number
  /**
   * Page number
   * @default 1
   * @example 1
   */
  page?: number
}

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from 'axios'
import axios from 'axios'

export type QueryParamsType = Record<string | number, any>

export interface FullRequestParams extends Omit<AxiosRequestConfig, 'data' | 'params' | 'url' | 'responseType'> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean
  /** request path */
  path: string
  /** content type of request body */
  type?: ContentType
  /** query params */
  query?: QueryParamsType
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType
  /** request body */
  body?: unknown
}

export type RequestParams = Omit<FullRequestParams, 'body' | 'method' | 'query' | 'path'>

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, 'data' | 'cancelToken'> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void
  secure?: boolean
  format?: ResponseType
}

export enum ContentType {
  Json = 'application/json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
  Text = 'text/plain',
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance
  private securityData: SecurityDataType | null = null
  private securityWorker?: ApiConfig<SecurityDataType>['securityWorker']
  private secure?: boolean
  private format?: ResponseType

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || 'http://localhost:3000' })
    this.secure = secure
    this.format = format
    this.securityWorker = securityWorker
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data
  }

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method)

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    }
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === 'object' && formItem !== null) {
      return JSON.stringify(formItem)
    } else {
      return `${formItem}`
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key]
      const propertyContent: any[] = property instanceof Array ? property : [property]

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem))
      }

      return formData
    }, new FormData())
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === 'boolean' ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {}
    const requestParams = this.mergeRequestParams(params, secureParams)
    const responseFormat = format || this.format || undefined

    if (type === ContentType.FormData && body && body !== null && typeof body === 'object') {
      body = this.createFormData(body as Record<string, unknown>)
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== 'string') {
      body = JSON.stringify(body)
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { 'Content-Type': type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    })
  }
}

/**
 * @title Cats example
 * @version 1.0
 * @baseUrl http://localhost:3000
 * @contact
 *
 * The cats API description
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  auth = {
    /**
     * No description
     *
     * @name AuthenticationControllerPostSignIn
     * @request POST:/auth/signin
     */
    authenticationControllerPostSignIn: (data: SignInRequestDto, params: RequestParams = {}) =>
      this.request<TokenResponseDto, any>({
        path: `/auth/signin`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name AuthenticationControllerPostSignInTime
     * @request POST:/auth/signin-time
     */
    authenticationControllerPostSignInTime: (
      query: AuthenticationControllerPostSignInTimeParams,
      data: SignInRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<TokenResponseDto, void>({
        path: `/auth/signin-time`,
        method: 'POST',
        query: query,
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name AuthenticationControllerPostSignout
     * @request POST:/auth/signout
     */
    authenticationControllerPostSignout: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/auth/signout`,
        method: 'POST',
        ...params,
      }),

    /**
     * No description
     *
     * @name AuthenticationControllerGetMe
     * @request GET:/auth/me
     */
    authenticationControllerGetMe: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/auth/me`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @name AuthenticationControllerGetRefresh
     * @request GET:/auth/refresh
     */
    authenticationControllerGetRefresh: (params: RequestParams = {}) =>
      this.request<AccessTokenResponseDto, any>({
        path: `/auth/refresh`,
        method: 'GET',
        format: 'json',
        ...params,
      }),
  }
  signUp = {
    /**
     * No description
     *
     * @name SignUpHttpControllerPost
     * @request POST:/sign-up/{userId}
     */
    signUpHttpControllerPost: (userId: string, data: SignUpRequestDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/sign-up/${userId}`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),
  }
  users = {
    /**
     * @description is it need a member table? since different between user and member.
     *
     * @name UsersControllerGetUserInfoByUserId
     * @request GET:/users/profile/{userId}
     */
    usersControllerGetUserInfoByUserId: (userId: string, params: RequestParams = {}) =>
      this.request<UserResponseDto, any>({
        path: `/users/profile/${userId}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name UsersControllerPatchUpdateUserByUserId
     * @request PATCH:/users/profile/{userId}
     */
    usersControllerPatchUpdateUserByUserId: (userId: string, data: UpdateUserRequestDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/users/profile/${userId}`,
        method: 'PATCH',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name UsersControllerGetUserInfo
     * @request GET:/users/profile
     */
    usersControllerGetUserInfo: (params: RequestParams = {}) =>
      this.request<UserResponseDto, any>({
        path: `/users/profile`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name UsersControllerPatchUpdateUser
     * @request PATCH:/users/profile
     */
    usersControllerPatchUpdateUser: (data: UpdateUserRequestDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/users/profile`,
        method: 'PATCH',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name UsersControllerGetRoles
     * @request GET:/users/roles
     */
    usersControllerGetRoles: (params: RequestParams = {}) =>
      this.request<RoleResponseDto[], any>({
        path: `/users/roles`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name UsersControllerPostGiveRole
     * @request POST:/users/make/admin
     */
    usersControllerPostGiveRole: (data: GiveRoleRequestDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/users/make/admin`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name CreateUserHttpContollerCreateUnregisteredUser
     * @request POST:/users
     */
    createUserHttpContollerCreateUnregisteredUser: (data: CreateUserRequestDto, params: RequestParams = {}) =>
      this.request<IdResponse, any>({
        path: `/users`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name FindUsersHttpControllerGetFindUsers
     * @request GET:/users
     */
    findUsersHttpControllerGetFindUsers: (
      query: FindUsersHttpControllerGetFindUsersParams,
      params: RequestParams = {},
    ) =>
      this.request<UserPaginatedResponseDto, any>({
        path: `/users`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name AddAvailableTaskHttpControllerPost
     * @request POST:/users/{userId}/available-tasks
     */
    addAvailableTaskHttpControllerPost: (
      userId: string,
      data: AddAvailableTaskRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/users/${userId}/available-tasks`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name DeleteAvailableTaskHttpControllerDelete
     * @request DELETE:/users/{userId}/available-tasks/{taskId}
     */
    deleteAvailableTaskHttpControllerDelete: (userId: string, taskId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/users/${userId}/available-tasks/${taskId}`,
        method: 'DELETE',
        ...params,
      }),

    /**
     * No description
     *
     * @name ModifyAssignmentTypeOfAvailableTaskHttpControllerPatch
     * @request PATCH:/users/{userId}/available-tasks/{taskId}
     */
    modifyAssignmentTypeOfAvailableTaskHttpControllerPatch: (
      userId: string,
      taskId: string,
      data: ModifyAssignmentTypeOfAvailableTaskRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/users/${userId}/available-tasks/${taskId}`,
        method: 'PATCH',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name HandsDownHttpControllerPatch
     * @request POST:/users/hands/down
     */
    handsDownHttpControllerPatch: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/users/hands/down`,
        method: 'POST',
        ...params,
      }),

    /**
     * No description
     *
     * @name HandsUpHttpControllerPatch
     * @request POST:/users/hands/up
     */
    handsUpHttpControllerPatch: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/users/hands/up`,
        method: 'POST',
        ...params,
      }),

    /**
     * No description
     *
     * @name CheckHandsStatusHttpControllerGet
     * @request GET:/users/hands/status
     */
    checkHandsStatusHttpControllerGet: (params: RequestParams = {}) =>
      this.request<HandsStatusResponseDto, any>({
        path: `/users/hands/status`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name ResetDefaultTasksHttpControllerPost
     * @request POST:/users/{userId}/reset-default-tasks
     */
    resetDefaultTasksHttpControllerPost: (userId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/users/${userId}/reset-default-tasks`,
        method: 'POST',
        ...params,
      }),

    /**
     * No description
     *
     * @name CheckInvitedUserHttpControllerGet
     * @request GET:/users/{userId}/invitations
     */
    checkInvitedUserHttpControllerGet: (userId: string, params: RequestParams = {}) =>
      this.request<UserResponseDto, any>({
        path: `/users/${userId}/invitations`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name ReactivateUserHttpControllerPost
     * @request PATCH:/users/{userId}/activate
     */
    reactivateUserHttpControllerPost: (userId: string, params: RequestParams = {}) =>
      this.request<IdResponse, any>({
        path: `/users/${userId}/activate`,
        method: 'PATCH',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name DeactivateUserHttpControllerPost
     * @request PATCH:/users/{userId}/deactivate
     */
    deactivateUserHttpControllerPost: (userId: string, params: RequestParams = {}) =>
      this.request<IdResponse, any>({
        path: `/users/${userId}/deactivate`,
        method: 'PATCH',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name ChangeUserRoleHttpControllerPost
     * @request POST:/users/{userId}/roles
     */
    changeUserRoleHttpControllerPost: (userId: string, data: ChangeUserRoleRequestDto, params: RequestParams = {}) =>
      this.request<IdResponse, any>({
        path: `/users/${userId}/roles`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name PutScheduleHttpControllerPut
     * @request PUT:/users/{userId}/schedules
     */
    putScheduleHttpControllerPut: (userId: string, data: PutScheduleRequestDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/users/${userId}/schedules`,
        method: 'PUT',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name FindSchedulePaginatedHttpControllerGet
     * @request GET:/users/schedule/total
     */
    findSchedulePaginatedHttpControllerGet: (
      query: FindSchedulePaginatedHttpControllerGetParams,
      params: RequestParams = {},
    ) =>
      this.request<SchedulePaginatedResponseDto, any>({
        path: `/users/schedule/total`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),
  }
  licenses = {
    /**
     * No description
     *
     * @name AppointUserLicenseHttpControllerPost
     * @request POST:/licenses/{abbreviation}
     */
    appointUserLicenseHttpControllerPost: (
      abbreviation: string,
      data: AppointUserLicenseRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/licenses/${abbreviation}`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name FindLicenseHttpControllerGet
     * @request GET:/licenses/{abbreviation}
     */
    findLicenseHttpControllerGet: (
      { abbreviation, ...query }: FindLicenseHttpControllerGetParams,
      params: RequestParams = {},
    ) =>
      this.request<LicenseResponseDto, any>({
        path: `/licenses/${abbreviation}`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name RevokeUserLicenseHttpControllerPost
     * @request DELETE:/licenses/{abbreviation}/users/{userId}
     */
    revokeUserLicenseHttpControllerPost: (
      { userId, abbreviation, ...query }: RevokeUserLicenseHttpControllerPostParams,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/licenses/${abbreviation}/users/${userId}`,
        method: 'DELETE',
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @name FindLicensePaginatedHttpControllerGet
     * @request GET:/licenses
     */
    findLicensePaginatedHttpControllerGet: (
      query: FindLicensePaginatedHttpControllerGetParams,
      params: RequestParams = {},
    ) =>
      this.request<LicensePaginatedResponseDto, any>({
        path: `/licenses`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name FindLicensableWorkersHttpControllerGet
     * @request GET:/licenses/licensable/workers
     */
    findLicensableWorkersHttpControllerGet: (params: RequestParams = {}) =>
      this.request<PositionUnregisteredUserResponseDto, any>({
        path: `/licenses/licensable/workers`,
        method: 'GET',
        format: 'json',
        ...params,
      }),
  }
  invitations = {
    /**
     * No description
     *
     * @name InviteHttpControllerPost
     * @request POST:/invitations
     */
    inviteHttpControllerPost: (data: InviteRequestDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/invitations`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),
  }
  organizations = {
    /**
     * No description
     *
     * @name FindOrganizationHttpControllerGet
     * @summary find organization.
     * @request GET:/organizations/{organizationId}
     */
    findOrganizationHttpControllerGet: (organizationId: string, params: RequestParams = {}) =>
      this.request<OrganizationResponseDto, any>({
        path: `/organizations/${organizationId}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name UpdateOrganizationHttpControllerPatch
     * @request PATCH:/organizations/{organizationId}
     */
    updateOrganizationHttpControllerPatch: (
      organizationId: string,
      data: UpdateOrganizationRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/organizations/${organizationId}`,
        method: 'PATCH',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name FindOrganizationPaginatedHttpControllerGetOrganizationPaginated
     * @summary Find Oraganization
     * @request GET:/organizations
     */
    findOrganizationPaginatedHttpControllerGetOrganizationPaginated: (
      query: FindOrganizationPaginatedHttpControllerGetOrganizationPaginatedParams,
      params: RequestParams = {},
    ) =>
      this.request<OrganizationPaginatedResponseDto, any>({
        path: `/organizations`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name CreateOrganizationHttpControllerPostCreateOrganization
     * @request POST:/organizations
     */
    createOrganizationHttpControllerPostCreateOrganization: (
      data: CreateOrganizationRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<IdResponse, any>({
        path: `/organizations`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name FindMemberPaginatedHttpControllerGet
     * @summary find members.
     * @request GET:/organizations/{organizationId}/members
     */
    findMemberPaginatedHttpControllerGet: (
      { organizationId, ...query }: FindMemberPaginatedHttpControllerGetParams,
      params: RequestParams = {},
    ) =>
      this.request<UserPaginatedResponseDto, any>({
        path: `/organizations/${organizationId}/members`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name FindMyMemberPaginatedHttpControllerGet
     * @summary find members.
     * @request GET:/organizations/members/my
     */
    findMyMemberPaginatedHttpControllerGet: (
      query: FindMyMemberPaginatedHttpControllerGetParams,
      params: RequestParams = {},
    ) =>
      this.request<UserPaginatedResponseDto, any>({
        path: `/organizations/members/my`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),
  }
  jobs = {
    /**
     * No description
     *
     * @name CreateJobHttpControllerCreateJob
     * @request POST:/jobs
     */
    createJobHttpControllerCreateJob: (data: CreateJobRequestDto, params: RequestParams = {}) =>
      this.request<IdResponse, any>({
        path: `/jobs`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name FindJobPaginatedHttpControllerFindJob
     * @summary Find job
     * @request GET:/jobs
     */
    findJobPaginatedHttpControllerFindJob: (
      query: FindJobPaginatedHttpControllerFindJobParams,
      params: RequestParams = {},
    ) =>
      this.request<JobPaginatedResponseDto, any>({
        path: `/jobs`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name UpdateJobHttpControllerUpdateJob
     * @request PATCH:/jobs/{jobId}
     */
    updateJobHttpControllerUpdateJob: (jobId: string, data: UpdateJobRequestDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/jobs/${jobId}`,
        method: 'PATCH',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name DeleteJobHttpControllerDelete
     * @request DELETE:/jobs/{jobId}
     */
    deleteJobHttpControllerDelete: (jobId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/jobs/${jobId}`,
        method: 'DELETE',
        ...params,
      }),

    /**
     * No description
     *
     * @name FindJobHttpControllerFindJob
     * @summary Find job
     * @request GET:/jobs/{jobId}
     */
    findJobHttpControllerFindJob: (jobId: string, params: RequestParams = {}) =>
      this.request<JobResponseDto, any>({
        path: `/jobs/${jobId}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name UpdateJobStatusHttpControllerUpdateJob
     * @request PATCH:/jobs/{jobId}/status
     */
    updateJobStatusHttpControllerUpdateJob: (
      jobId: string,
      data: UpdateJobStatusRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/jobs/${jobId}/status`,
        method: 'PATCH',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name SendDeliverablesHttpControllerUpdateJob
     * @request PATCH:/jobs/{jobId}/send-deliverables
     */
    sendDeliverablesHttpControllerUpdateJob: (jobId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/jobs/${jobId}/send-deliverables`,
        method: 'PATCH',
        ...params,
      }),
  }
  myJobs = {
    /**
     * No description
     *
     * @name FindMyJobPaginatedHttpControllerFindJob
     * @summary Find My jobs.
     * @request GET:/my-jobs
     */
    findMyJobPaginatedHttpControllerFindJob: (
      query: FindMyJobPaginatedHttpControllerFindJobParams,
      params: RequestParams = {},
    ) =>
      this.request<JobPaginatedResponseDto, any>({
        path: `/my-jobs`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),
  }
  jobsToInvoice = {
    /**
     * No description
     *
     * @name FindJobToInvoiceHttpControllerFindJob
     * @request GET:/jobs-to-invoice
     */
    findJobToInvoiceHttpControllerFindJob: (
      query: FindJobToInvoiceHttpControllerFindJobParams,
      params: RequestParams = {},
    ) =>
      this.request<JobToInvoiceResponseDto, any>({
        path: `/jobs-to-invoice`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),
  }
  myOrderedJobs = {
    /**
     * No description
     *
     * @name FindMyOrderedJobPaginatedHttpControllerFindJob
     * @summary Find My ordered jobs.
     * @request GET:/my-ordered-jobs
     */
    findMyOrderedJobPaginatedHttpControllerFindJob: (
      query: FindMyOrderedJobPaginatedHttpControllerFindJobParams,
      params: RequestParams = {},
    ) =>
      this.request<JobPaginatedResponseDto, any>({
        path: `/my-ordered-jobs`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),
  }
  services = {
    /**
     * No description
     *
     * @name CreateServiceHttpControllerPostCreateService
     * @request POST:/services
     */
    createServiceHttpControllerPostCreateService: (data: CreateServiceRequestDto, params: RequestParams = {}) =>
      this.request<
        IdResponse,
        {
          /** @example 409 */
          statusCode: number
          /** @example "This service name is already existed." */
          message: string
          /** @example "40100" */
          error?: string
        }
      >({
        path: `/services`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name FindServicePaginatedHttpControllerGet
     * @request GET:/services
     */
    findServicePaginatedHttpControllerGet: (
      query: FindServicePaginatedHttpControllerGetParams,
      params: RequestParams = {},
    ) =>
      this.request<ServicePaginatedResponseDto, any>({
        path: `/services`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name UpdateServiceHttpControllerPatch
     * @request PUT:/services/{serviceId}
     */
    updateServiceHttpControllerPatch: (serviceId: string, data: UpdateServiceRequestDto, params: RequestParams = {}) =>
      this.request<
        void,
        | {
            /** @example 404 */
            statusCode: number
            /** @example "Service is not found." */
            message: string
            /** @example "40102" */
            error?: string
          }
        | {
            /** @example 409 */
            statusCode: number
            /** @example "This service name is already existed." */
            message: string
            /** @example "40100" */
            error?: string
          }
      >({
        path: `/services/${serviceId}`,
        method: 'PUT',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name DeleteServiceHttpControllerDelete
     * @request DELETE:/services/{serviceId}
     */
    deleteServiceHttpControllerDelete: (serviceId: string, params: RequestParams = {}) =>
      this.request<
        void,
        {
          /** @example 404 */
          statusCode: number
          /** @example "Service is not found." */
          message: string
          /** @example "40102" */
          error?: string
        }
      >({
        path: `/services/${serviceId}`,
        method: 'DELETE',
        ...params,
      }),

    /**
     * No description
     *
     * @name FindServiceHttpControllerGet
     * @request GET:/services/{serviceId}
     */
    findServiceHttpControllerGet: (serviceId: string, params: RequestParams = {}) =>
      this.request<ServiceResponseDto, any>({
        path: `/services/${serviceId}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),
  }
  searchCensus = {
    /**
     * @description Census에서 행정구역이 매칭되지 않는 주소들이 있음 Census 결과와 상관 없이 프로젝트는 생성되어야함
     *
     * @name SearchCensusHttpControllerPostSearchCensus
     * @request POST:/search-census
     */
    searchCensusHttpControllerPostSearchCensus: (data: AddressFromMapBox, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/search-census`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),
  }
  projects = {
    /**
     * No description
     *
     * @name CreateProjectHttpControllerPostCreateProejct
     * @request POST:/projects
     */
    createProjectHttpControllerPostCreateProejct: (data: CreateProjectRequestDto, params: RequestParams = {}) =>
      this.request<IdResponse, any>({
        path: `/projects`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name FindProjectsHttpControllerFindUsers
     * @summary Find projects
     * @request GET:/projects
     */
    findProjectsHttpControllerFindUsers: (
      query: FindProjectsHttpControllerFindUsersParams,
      params: RequestParams = {},
    ) =>
      this.request<ProjectPaginatedResponseDto, any>({
        path: `/projects`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name UpdateProjectHttpControllerUpdate
     * @request PATCH:/projects/{projectId}
     */
    updateProjectHttpControllerUpdate: (projectId: string, data: UpdateProjectRequestDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/projects/${projectId}`,
        method: 'PATCH',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name DeleteProjectHttpControllerDelete
     * @request DELETE:/projects/{projectId}
     */
    deleteProjectHttpControllerDelete: (projectId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/projects/${projectId}`,
        method: 'DELETE',
        ...params,
      }),

    /**
     * No description
     *
     * @name FindProjectDetailHttpControllerFindProjectDetail
     * @summary Find projects
     * @request GET:/projects/{projectId}
     */
    findProjectDetailHttpControllerFindProjectDetail: (projectId: string, params: RequestParams = {}) =>
      this.request<ProjectResponseDto, any>({
        path: `/projects/${projectId}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),
  }
  projectsCount = {
    /**
     * No description
     *
     * @name FindProjectsCountHttpControllerFindUsers
     * @summary Find projects count
     * @request GET:/projects-count
     */
    findProjectsCountHttpControllerFindUsers: (params: RequestParams = {}) =>
      this.request<ProjectsCountResponseDto, any>({
        path: `/projects-count`,
        method: 'GET',
        format: 'json',
        ...params,
      }),
  }
  geography = {
    /**
     * No description
     *
     * @tags geography
     * @name GeographyControllerGetFindNotes
     * @request GET:/geography/notes
     * @secure
     */
    geographyControllerGetFindNotes: (query: GeographyControllerGetFindNotesParams, params: RequestParams = {}) =>
      this.request<AhjNotePaginatedResponseDto, any>({
        path: `/geography/notes`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags geography
     * @name GeographyControllerGetFindNoteByGeoId
     * @request GET:/geography/{geoId}/notes
     * @secure
     */
    geographyControllerGetFindNoteByGeoId: (geoId: string, params: RequestParams = {}) =>
      this.request<AhjNoteResponseDto, any>({
        path: `/geography/${geoId}/notes`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags geography
     * @name GeographyControllerPutUpdateNote
     * @request PUT:/geography/{geoId}/notes
     * @secure
     */
    geographyControllerPutUpdateNote: (geoId: string, data: UpdateAhjNoteRequestDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/geography/${geoId}/notes`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags geography
     * @name GeographyControllerDeleteNoteByGeoId
     * @request DELETE:/geography/{geoId}/notes
     * @secure
     */
    geographyControllerDeleteNoteByGeoId: (geoId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/geography/${geoId}/notes`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags geography
     * @name GeographyControllerGetFinNoteUpdateHistoryDetail
     * @request GET:/geography/{geoId}/notes/history
     * @secure
     */
    geographyControllerGetFinNoteUpdateHistoryDetail: (
      { geoId, ...query }: GeographyControllerGetFinNoteUpdateHistoryDetailParams,
      params: RequestParams = {},
    ) =>
      this.request<AhjNoteHistoryResponseDto, any>({
        path: `/geography/${geoId}/notes/history`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags geography
     * @name GeographyControllerGetFindNoteUpdateHistory
     * @request GET:/geography/notes/history
     * @secure
     */
    geographyControllerGetFindNoteUpdateHistory: (
      query: GeographyControllerGetFindNoteUpdateHistoryParams,
      params: RequestParams = {},
    ) =>
      this.request<AhjNoteHistoryPaginatedResponseDto, any>({
        path: `/geography/notes/history`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),
  }
  assignedTasks = {
    /**
     * No description
     *
     * @name AssignTaskHttpControllerPatch
     * @request PATCH:/assigned-tasks/{assignedTaskId}/assign
     */
    assignTaskHttpControllerPatch: (assignedTaskId: string, data: AssignTaskRequestDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/assigned-tasks/${assignedTaskId}/assign`,
        method: 'PATCH',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name FindAssignedTaskHttpControllerGet
     * @request GET:/assigned-tasks/{assignedTaskId}
     */
    findAssignedTaskHttpControllerGet: (assignedTaskId: string, params: RequestParams = {}) =>
      this.request<AssignedTaskResponseDto, any>({
        path: `/assigned-tasks/${assignedTaskId}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * @description Assigned Task는 Job 조회를 통해서 하도록 설계하였으나 혹시나해서 구현해둠
     *
     * @name FindAssignedTaskPaginatedHttpControllerGet
     * @request GET:/assigned-tasks
     */
    findAssignedTaskPaginatedHttpControllerGet: (
      query: FindAssignedTaskPaginatedHttpControllerGetParams,
      params: RequestParams = {},
    ) =>
      this.request<AssignedTaskPaginatedResponseDto, any>({
        path: `/assigned-tasks`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name FindAssignedTaskSummaryDonePaginatedHttpControllerGet
     * @request GET:/assigned-tasks/summary/done
     */
    findAssignedTaskSummaryDonePaginatedHttpControllerGet: (
      query: FindAssignedTaskSummaryDonePaginatedHttpControllerGetParams,
      params: RequestParams = {},
    ) =>
      this.request<AssignedTaskSummaryDonePaginatedResponseDto, any>({
        path: `/assigned-tasks/summary/done`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name FindAssignedTaskSummaryDetailPaginatedHttpControllerGet
     * @request GET:/assigned-tasks/summary/detail
     */
    findAssignedTaskSummaryDetailPaginatedHttpControllerGet: (
      query: FindAssignedTaskSummaryDetailPaginatedHttpControllerGetParams,
      params: RequestParams = {},
    ) =>
      this.request<AssignedTaskSummaryDetailPaginatedResponseDto, any>({
        path: `/assigned-tasks/summary/detail`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name FindAssignedTaskSummaryInProgressPaginatedHttpControllerGet
     * @request GET:/assigned-tasks/summary/in-progress
     */
    findAssignedTaskSummaryInProgressPaginatedHttpControllerGet: (
      query: FindAssignedTaskSummaryInProgressPaginatedHttpControllerGetParams,
      params: RequestParams = {},
    ) =>
      this.request<AssignedTaskSummaryInProgressPaginatedResponseDto, any>({
        path: `/assigned-tasks/summary/in-progress`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name FindAssignedTaskSummaryTotalPaginatedHttpControllerGet
     * @request GET:/assigned-tasks/summary/total
     */
    findAssignedTaskSummaryTotalPaginatedHttpControllerGet: (
      query: FindAssignedTaskSummaryTotalPaginatedHttpControllerGetParams,
      params: RequestParams = {},
    ) =>
      this.request<AssignedTaskSummaryTotalPaginatedResponseDto, any>({
        path: `/assigned-tasks/summary/total`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name CompleteAssignedTaskHttpControllerPatch
     * @request PATCH:/assigned-tasks/complete/{assignedTaskId}
     */
    completeAssignedTaskHttpControllerPatch: (assignedTaskId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/assigned-tasks/complete/${assignedTaskId}`,
        method: 'PATCH',
        ...params,
      }),

    /**
     * No description
     *
     * @name UpdateTaskDurationHttpControllerPatch
     * @request PATCH:/assigned-tasks/{assignedTaskId}/duration
     */
    updateTaskDurationHttpControllerPatch: (
      assignedTaskId: string,
      data: UpdateTaskDurationRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/assigned-tasks/${assignedTaskId}/duration`,
        method: 'PATCH',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name UpdateTaskCostHttpControllerPatch
     * @request PATCH:/assigned-tasks/{assignedTaskId}/cost
     */
    updateTaskCostHttpControllerPatch: (
      assignedTaskId: string,
      data: UpdateTaskCostRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/assigned-tasks/${assignedTaskId}/cost`,
        method: 'PATCH',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name FindAvailableWorkersHttpControllerGet
     * @request GET:/assigned-tasks/{assignedTaskId}/available-workers
     */
    findAvailableWorkersHttpControllerGet: (assignedTaskId: string, params: RequestParams = {}) =>
      this.request<AvailableWorkerResponseDto[], any>({
        path: `/assigned-tasks/${assignedTaskId}/available-workers`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name UnassignAssignedTaskHttpControllerPatch
     * @request PATCH:/assigned-tasks/{assignedTaskId}/unassign
     */
    unassignAssignedTaskHttpControllerPatch: (assignedTaskId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/assigned-tasks/${assignedTaskId}/unassign`,
        method: 'PATCH',
        ...params,
      }),

    /**
     * No description
     *
     * @name RejectAssignedTaskHttpControllerPatch
     * @request PATCH:/assigned-tasks/{assignedTaskId}/reject
     */
    rejectAssignedTaskHttpControllerPatch: (
      assignedTaskId: string,
      data: RejectAssignedTaskRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/assigned-tasks/${assignedTaskId}/reject`,
        method: 'PATCH',
        body: data,
        type: ContentType.Json,
        ...params,
      }),
  }
  rejectedTaskReasons = {
    /**
     * No description
     *
     * @name FindRejectedTaskReasonHttpControllerGet
     * @request GET:/rejected-task-reasons
     */
    findRejectedTaskReasonHttpControllerGet: (
      query: FindRejectedTaskReasonHttpControllerGetParams,
      params: RequestParams = {},
    ) =>
      this.request<RejectedTaskReasonPaginatedResponseDto, any>({
        path: `/rejected-task-reasons`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),
  }
  expensePricings = {
    /**
     * No description
     *
     * @name CreateExpensePricingHttpControllerPost
     * @request POST:/expense-pricings
     */
    createExpensePricingHttpControllerPost: (data: CreateExpensePricingRequestDto, params: RequestParams = {}) =>
      this.request<IdResponse, any>({
        path: `/expense-pricings`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name FindExpensePricingPaginatedHttpControllerGet
     * @request GET:/expense-pricings
     */
    findExpensePricingPaginatedHttpControllerGet: (
      query: FindExpensePricingPaginatedHttpControllerGetParams,
      params: RequestParams = {},
    ) =>
      this.request<ExpensePricingPaginatedResponseDto, any>({
        path: `/expense-pricings`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name UpdateExpensePricingHttpControllerPatch
     * @request PATCH:/expense-pricings/{organizationId}/{taskId}
     */
    updateExpensePricingHttpControllerPatch: (
      taskId: string,
      organizationId: string,
      data: UpdateExpensePricingRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/expense-pricings/${organizationId}/${taskId}`,
        method: 'PATCH',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name DeleteExpensePricingHttpControllerDelete
     * @request DELETE:/expense-pricings/{organizationId}/{taskId}
     */
    deleteExpensePricingHttpControllerDelete: (taskId: string, organizationId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/expense-pricings/${organizationId}/${taskId}`,
        method: 'DELETE',
        ...params,
      }),

    /**
     * No description
     *
     * @name FindExpensePricingHttpControllerGet
     * @request GET:/expense-pricings/{organizationId}/{taskId}
     */
    findExpensePricingHttpControllerGet: (taskId: string, organizationId: string, params: RequestParams = {}) =>
      this.request<ExpensePricingResponseDto, any>({
        path: `/expense-pricings/${organizationId}/${taskId}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),
  }
  creatableExpensePricings = {
    /**
     * No description
     *
     * @name FindCreatableExpensePricingHttpControllerGet
     * @request GET:/creatable-expense-pricings
     */
    findCreatableExpensePricingHttpControllerGet: (
      query: FindCreatableExpensePricingHttpControllerGetParams,
      params: RequestParams = {},
    ) =>
      this.request<CreatableExpensePricingResponse[], any>({
        path: `/creatable-expense-pricings`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),
  }
  invoices = {
    /**
     * No description
     *
     * @name CreateInvoiceHttpControllerPost
     * @request POST:/invoices
     */
    createInvoiceHttpControllerPost: (data: CreateInvoiceRequestDto, params: RequestParams = {}) =>
      this.request<IdResponse, any>({
        path: `/invoices`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name FindInvoicePaginatedHttpControllerGet
     * @request GET:/invoices
     */
    findInvoicePaginatedHttpControllerGet: (
      query: FindInvoicePaginatedHttpControllerGetParams,
      params: RequestParams = {},
    ) =>
      this.request<InvoicePaginatedResponseDto, any>({
        path: `/invoices`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name UpdateInvoiceHttpControllerPatch
     * @request PATCH:/invoices/{invoiceId}
     */
    updateInvoiceHttpControllerPatch: (invoiceId: string, data: UpdateInvoiceRequestDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/invoices/${invoiceId}`,
        method: 'PATCH',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name DeleteInvoiceHttpControllerDelete
     * @request DELETE:/invoices/{invoiceId}
     */
    deleteInvoiceHttpControllerDelete: (invoiceId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/invoices/${invoiceId}`,
        method: 'DELETE',
        ...params,
      }),

    /**
     * No description
     *
     * @name FindInvoiceHttpControllerGet
     * @request GET:/invoices/{invoiceId}
     */
    findInvoiceHttpControllerGet: (invoiceId: string, params: RequestParams = {}) =>
      this.request<InvoiceResponseDto, any>({
        path: `/invoices/${invoiceId}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name IssueInvoiceHttpControllerPatch
     * @request PATCH:/invoices/{invoiceId}/issue
     */
    issueInvoiceHttpControllerPatch: (invoiceId: string, data: IssueInvoiceRequestDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/invoices/${invoiceId}/issue`,
        method: 'PATCH',
        body: data,
        type: ContentType.Json,
        ...params,
      }),
  }
  invoicesClients = {
    /**
     * No description
     *
     * @name FindClientToInvoiceHttpControllerGet
     * @request GET:/invoices-clients
     */
    findClientToInvoiceHttpControllerGet: (params: RequestParams = {}) =>
      this.request<ClientToInvoiceResponseDto, any>({
        path: `/invoices-clients`,
        method: 'GET',
        format: 'json',
        ...params,
      }),
  }
  clientWithOutstandingBalances = {
    /**
     * No description
     *
     * @name FindClientWithOutstandingBalancesHttpControllerGet
     * @request GET:/client-with-outstanding-balances
     */
    findClientWithOutstandingBalancesHttpControllerGet: (
      query: FindClientWithOutstandingBalancesHttpControllerGetParams,
      params: RequestParams = {},
    ) =>
      this.request<ClientWithOutstandingBalancesPaginatedResponseDto, any>({
        path: `/client-with-outstanding-balances`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),
  }
  overdueInvoices = {
    /**
     * No description
     *
     * @name FindOverdueInvoicePaginatedHttpControllerGet
     * @request GET:/overdue-invoices
     */
    findOverdueInvoicePaginatedHttpControllerGet: (
      query: FindOverdueInvoicePaginatedHttpControllerGetParams,
      params: RequestParams = {},
    ) =>
      this.request<InvoicePaginatedResponseDto, any>({
        path: `/overdue-invoices`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),
  }
  customPricings = {
    /**
     * No description
     *
     * @name CreateCustomPricingHttpControllerPost
     * @request POST:/custom-pricings
     */
    createCustomPricingHttpControllerPost: (data: CreateCustomPricingRequestDto, params: RequestParams = {}) =>
      this.request<
        IdResponse,
        | {
            /** @example 404 */
            statusCode: number
            /** @example "Not Organization Found" */
            message: string
            /** @example "20002" */
            error?: string
          }
        | {
            /** @example 409 */
            statusCode: number
            /** @example "CustomPricing is Already Existed" */
            message: string
            /** @example "30101" */
            error?: string
          }
      >({
        path: `/custom-pricings`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name FindCustomPricingPaginatedHttpControllerGet
     * @request GET:/custom-pricings
     */
    findCustomPricingPaginatedHttpControllerGet: (
      query: FindCustomPricingPaginatedHttpControllerGetParams,
      params: RequestParams = {},
    ) =>
      this.request<CustomPricingPaginatedResponseDto, any>({
        path: `/custom-pricings`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name UpdateCustomPricingHttpControllerPut
     * @request PUT:/custom-pricings/{organizationId}/{serviceId}
     */
    updateCustomPricingHttpControllerPut: (
      organizationId: string,
      serviceId: string,
      data: UpdateCustomPricingRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/custom-pricings/${organizationId}/${serviceId}`,
        method: 'PUT',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name DeleteCustomPricingHttpControllerDelete
     * @request DELETE:/custom-pricings/{organizationId}/{serviceId}
     */
    deleteCustomPricingHttpControllerDelete: (organizationId: string, serviceId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/custom-pricings/${organizationId}/${serviceId}`,
        method: 'DELETE',
        ...params,
      }),

    /**
     * No description
     *
     * @name FindCustomPricingHttpControllerGet
     * @request GET:/custom-pricings/{organizationId}/{serviceId}
     */
    findCustomPricingHttpControllerGet: (organizationId: string, serviceId: string, params: RequestParams = {}) =>
      this.request<CustomPricingResponseDto, any>({
        path: `/custom-pricings/${organizationId}/${serviceId}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),
  }
  creatableCustomPricings = {
    /**
     * No description
     *
     * @name FindCreatableCustomPricingHttpControllerGet
     * @request GET:/creatable-custom-pricings
     */
    findCreatableCustomPricingHttpControllerGet: (
      query: FindCreatableCustomPricingHttpControllerGetParams,
      params: RequestParams = {},
    ) =>
      this.request<CreatableCustomPricingResponse[], any>({
        path: `/creatable-custom-pricings`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),
  }
  positions = {
    /**
     * No description
     *
     * @name CreatePositionHttpControllerPost
     * @request POST:/positions
     */
    createPositionHttpControllerPost: (data: CreatePositionRequestDto, params: RequestParams = {}) =>
      this.request<IdResponse, any>({
        path: `/positions`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name FindPositionPaginatedHttpControllerGet
     * @request GET:/positions
     */
    findPositionPaginatedHttpControllerGet: (
      query: FindPositionPaginatedHttpControllerGetParams,
      params: RequestParams = {},
    ) =>
      this.request<PositionPaginatedResponseDto, any>({
        path: `/positions`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name UpdatePositionHttpControllerPatch
     * @request PATCH:/positions/{positionId}
     */
    updatePositionHttpControllerPatch: (
      positionId: string,
      data: UpdatePositionRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/positions/${positionId}`,
        method: 'PATCH',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name DeletePositionHttpControllerDelete
     * @request DELETE:/positions/{positionId}
     */
    deletePositionHttpControllerDelete: (positionId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/positions/${positionId}`,
        method: 'DELETE',
        ...params,
      }),

    /**
     * No description
     *
     * @name FindPositionHttpControllerGet
     * @request GET:/positions/{positionId}
     */
    findPositionHttpControllerGet: (positionId: string, params: RequestParams = {}) =>
      this.request<PositionResponseDto, any>({
        path: `/positions/${positionId}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name AddPositionTaskHttpControllerPost
     * @request POST:/positions/{positionId}/tasks
     */
    addPositionTaskHttpControllerPost: (
      positionId: string,
      data: AddPositionTaskRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/positions/${positionId}/tasks`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name DeletePositionTaskHttpControllerDelete
     * @request DELETE:/positions/{positionId}/tasks/{taskId}
     */
    deletePositionTaskHttpControllerDelete: (positionId: string, taskId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/positions/${positionId}/tasks/${taskId}`,
        method: 'DELETE',
        ...params,
      }),

    /**
     * No description
     *
     * @name UpdatePositionTaskAutoAssignmentTypeHttpControllerPatch
     * @request PATCH:/positions/{positionId}/tasks/{taskId}
     */
    updatePositionTaskAutoAssignmentTypeHttpControllerPatch: (
      positionId: string,
      taskId: string,
      data: UpdatePositionTaskAutoAssignmentTypeRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/positions/${positionId}/tasks/${taskId}`,
        method: 'PATCH',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name AddPositionWorkerHttpControllerPost
     * @request POST:/positions/{positionId}/users
     */
    addPositionWorkerHttpControllerPost: (
      positionId: string,
      data: AddPositionWorkerRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/positions/${positionId}/users`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name DeletePositionWorkerHttpControllerDelete
     * @request DELETE:/positions/{positionId}/users/{userId}
     */
    deletePositionWorkerHttpControllerDelete: (positionId: string, userId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/positions/${positionId}/users/${userId}`,
        method: 'DELETE',
        ...params,
      }),

    /**
     * No description
     *
     * @name FindPositionUnRegisteredUsersHttpControllerGet
     * @request GET:/positions/{positionId}/unregistered-users
     */
    findPositionUnRegisteredUsersHttpControllerGet: (positionId: string, params: RequestParams = {}) =>
      this.request<PositionUnregisteredUserResponseDto, any>({
        path: `/positions/${positionId}/unregistered-users`,
        method: 'GET',
        format: 'json',
        ...params,
      }),
  }
  ptos = {
    /**
     * No description
     *
     * @name CreatePtoHttpControllerPost
     * @request POST:/ptos
     */
    createPtoHttpControllerPost: (data: CreatePtoRequestDto, params: RequestParams = {}) =>
      this.request<IdResponse, any>({
        path: `/ptos`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name FindPtoPaginatedHttpControllerGet
     * @request GET:/ptos
     */
    findPtoPaginatedHttpControllerGet: (query: FindPtoPaginatedHttpControllerGetParams, params: RequestParams = {}) =>
      this.request<PtoPaginatedResponseDto, any>({
        path: `/ptos`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name UpdatePtoTotalHttpControllerPatch
     * @request PATCH:/ptos/{ptoId}/total
     */
    updatePtoTotalHttpControllerPatch: (ptoId: string, data: UpdatePtoTotalRequestDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/ptos/${ptoId}/total`,
        method: 'PATCH',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name UpdatePtoPayHttpControllerPatch
     * @request PATCH:/ptos/{ptoId}/pay
     */
    updatePtoPayHttpControllerPatch: (ptoId: string, data: UpdatePtoPayRequestDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/ptos/${ptoId}/pay`,
        method: 'PATCH',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name CreatePtoDetailHttpControllerPost
     * @request POST:/ptos/detail
     */
    createPtoDetailHttpControllerPost: (data: CreatePtoDetailRequestDto, params: RequestParams = {}) =>
      this.request<IdResponse, any>({
        path: `/ptos/detail`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name FindPtoDetailPaginatedHttpControllerGet
     * @request GET:/ptos/detail
     */
    findPtoDetailPaginatedHttpControllerGet: (
      query: FindPtoDetailPaginatedHttpControllerGetParams,
      params: RequestParams = {},
    ) =>
      this.request<PtoDetailPaginatedResponseDto, any>({
        path: `/ptos/detail`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name UpdatePtoDetailHttpControllerPatch
     * @request PATCH:/ptos/{ptoDetailId}/detail
     */
    updatePtoDetailHttpControllerPatch: (
      ptoDetailId: string,
      data: UpdatePtoDetailRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/ptos/${ptoDetailId}/detail`,
        method: 'PATCH',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name DeletePtoDetailHttpControllerDelete
     * @request DELETE:/ptos/{ptoDetailId}/detail
     */
    deletePtoDetailHttpControllerDelete: (ptoDetailId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/ptos/${ptoDetailId}/detail`,
        method: 'DELETE',
        ...params,
      }),

    /**
     * No description
     *
     * @name FindPtoAnnualPaginatedHttpControllerGet
     * @request GET:/ptos/annual
     */
    findPtoAnnualPaginatedHttpControllerGet: (
      query: FindPtoAnnualPaginatedHttpControllerGetParams,
      params: RequestParams = {},
    ) =>
      this.request<PtoAnnualPaginatedResponseDto, any>({
        path: `/ptos/annual`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name FindPtoTypePaginatedHttpControllerGet
     * @request GET:/ptos/type
     */
    findPtoTypePaginatedHttpControllerGet: (
      query: FindPtoTypePaginatedHttpControllerGetParams,
      params: RequestParams = {},
    ) =>
      this.request<PtoTypePaginatedResponseDto, any>({
        path: `/ptos/type`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),
  }
  ptoTenurePolicies = {
    /**
     * No description
     *
     * @name UpdatePtoTenurePolicyHttpControllerPatch
     * @request PATCH:/pto-tenure-policies/{ptoTenurePolicyId}
     */
    updatePtoTenurePolicyHttpControllerPatch: (
      ptoTenurePolicyId: string,
      data: UpdatePtoTenurePolicyRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/pto-tenure-policies/${ptoTenurePolicyId}`,
        method: 'PATCH',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name FindPtoTenurePolicyPaginatedHttpControllerGet
     * @request GET:/pto-tenure-policies
     */
    findPtoTenurePolicyPaginatedHttpControllerGet: (
      query: FindPtoTenurePolicyPaginatedHttpControllerGetParams,
      params: RequestParams = {},
    ) =>
      this.request<PtoTenurePolicyPaginatedResponseDto, any>({
        path: `/pto-tenure-policies`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),
  }
  creditTransactions = {
    /**
     * No description
     *
     * @name CreateCreditTransactionHttpControllerPost
     * @request POST:/credit-transactions
     */
    createCreditTransactionHttpControllerPost: (data: CreateCreditTransactionRequestDto, params: RequestParams = {}) =>
      this.request<IdResponse, any>({
        path: `/credit-transactions`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name FindCreditTransactionPaginatedHttpControllerGet
     * @request GET:/credit-transactions
     */
    findCreditTransactionPaginatedHttpControllerGet: (
      query: FindCreditTransactionPaginatedHttpControllerGetParams,
      params: RequestParams = {},
    ) =>
      this.request<CreditTransactionPaginatedResponseDto, any>({
        path: `/credit-transactions`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name CancelCreditTransactionHttpControllerPatch
     * @request PATCH:/credit-transactions/{creditTransactionId}/cancel
     */
    cancelCreditTransactionHttpControllerPatch: (creditTransactionId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/credit-transactions/${creditTransactionId}/cancel`,
        method: 'PATCH',
        ...params,
      }),

    /**
     * No description
     *
     * @name FindCreditTransactionHttpControllerGet
     * @request GET:/credit-transactions/{creditTransactionId}
     */
    findCreditTransactionHttpControllerGet: (creditTransactionId: string, params: RequestParams = {}) =>
      this.request<CreditTransactionResponseDto, any>({
        path: `/credit-transactions/${creditTransactionId}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name FindOrganizationCreditTransactionHttpControllerGet
     * @request GET:/credit-transactions/organizations/{organizationId}
     */
    findOrganizationCreditTransactionHttpControllerGet: (organizationId: string, params: RequestParams = {}) =>
      this.request<CreditOrganizationTransactionResponseDto, any>({
        path: `/credit-transactions/organizations/${organizationId}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),
  }
  payments = {
    /**
     * No description
     *
     * @name CreatePaymentHttpControllerPost
     * @summary 크레딧 결제는 POST /credit-transactions API를 사용합니다.
     * @request POST:/payments
     */
    createPaymentHttpControllerPost: (data: CreatePaymentRequestDto, params: RequestParams = {}) =>
      this.request<IdResponse, any>({
        path: `/payments`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name FindPaymentPaginatedHttpControllerGet
     * @request GET:/payments
     */
    findPaymentPaginatedHttpControllerGet: (
      query: FindPaymentPaginatedHttpControllerGetParams,
      params: RequestParams = {},
    ) =>
      this.request<PaymentPaginatedResponseDto, any>({
        path: `/payments`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name CancelPaymentHttpControllerPatch
     * @request PATCH:/payments/{paymentId}
     */
    cancelPaymentHttpControllerPatch: (paymentId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/payments/${paymentId}`,
        method: 'PATCH',
        ...params,
      }),

    /**
     * No description
     *
     * @name FindPaymentHttpControllerGet
     * @request GET:/payments/{paymentId}
     */
    findPaymentHttpControllerGet: (paymentId: string, params: RequestParams = {}) =>
      this.request<PaymentResponseDto, any>({
        path: `/payments/${paymentId}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),
  }
  orderedServices = {
    /**
     * No description
     *
     * @name CreateOrderedServiceHttpControllerPost
     * @request POST:/ordered-services
     */
    createOrderedServiceHttpControllerPost: (data: CreateOrderedServiceRequestDto, params: RequestParams = {}) =>
      this.request<IdResponse, any>({
        path: `/ordered-services`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name FindOrderedServicePaginatedHttpControllerGet
     * @request GET:/ordered-services
     */
    findOrderedServicePaginatedHttpControllerGet: (
      {
        orderedServiceStatus,
        projectPropertyType,
        mountingType,
        isRevision,
        serviceName,
        organizationName,
        jobName,
        ...query
      }: FindOrderedServicePaginatedHttpControllerGetParams,
      params: RequestParams = {},
    ) =>
      this.request<OrderedServicePaginatedResponseDto, any>({
        path: `/ordered-services`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name UpdateOrderedServiceHttpControllerPatch
     * @request PATCH:/ordered-services/{orderedServiceId}
     */
    updateOrderedServiceHttpControllerPatch: (
      orderedServiceId: string,
      data: UpdateOrderedServiceRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/ordered-services/${orderedServiceId}`,
        method: 'PATCH',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name FindOrderedServiceHttpControllerGet
     * @request GET:/ordered-services/{orderedServiceId}
     */
    findOrderedServiceHttpControllerGet: (orderedServiceId: string, params: RequestParams = {}) =>
      this.request<OrderedServiceResponseDto, any>({
        path: `/ordered-services/${orderedServiceId}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name UpdateOrderedScopeStatusHttpControllerPatch
     * @request PATCH:/ordered-services/{orderedScopeId}/status
     */
    updateOrderedScopeStatusHttpControllerPatch: (
      orderedScopeId: string,
      data: UpdateOrderedScopeStatusRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/ordered-services/${orderedScopeId}/status`,
        method: 'PATCH',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name UpdateManualPriceHttpControllerPatch
     * @request PATCH:/ordered-services/{orderedServiceId}/manual-price
     */
    updateManualPriceHttpControllerPatch: (
      orderedServiceId: string,
      data: UpdateManualPriceRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/ordered-services/${orderedServiceId}/manual-price`,
        method: 'PATCH',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name UpdateRevisionSizeHttpControllerPatch
     * @request PATCH:/ordered-services/{orderedServiceId}/revision-size
     */
    updateRevisionSizeHttpControllerPatch: (
      orderedServiceId: string,
      data: UpdateRevisionSizeRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/ordered-services/${orderedServiceId}/revision-size`,
        method: 'PATCH',
        body: data,
        type: ContentType.Json,
        ...params,
      }),
  }
  integratedOrderModificationHistory = {
    /**
     * No description
     *
     * @name FindIntegratedOrderModificationHistoryHttpControllerGet
     * @request GET:/integrated-order-modification-history/{jobId}/{entityId}/{attribute}/{modifiedAt}
     */
    findIntegratedOrderModificationHistoryHttpControllerGet: (
      entityId: string,
      jobId: string,
      attribute: string,
      modifiedAt: string,
      params: RequestParams = {},
    ) =>
      this.request<IntegratedOrderModificationHistoryResponseDto, any>({
        path: `/integrated-order-modification-history/${jobId}/${entityId}/${attribute}/${modifiedAt}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name FindIntegratedOrderModificationHistoryPaginatedHttpControllerGet
     * @request GET:/integrated-order-modification-history
     */
    findIntegratedOrderModificationHistoryPaginatedHttpControllerGet: (
      query: FindIntegratedOrderModificationHistoryPaginatedHttpControllerGetParams,
      params: RequestParams = {},
    ) =>
      this.request<IntegratedOrderModificationHistoryPaginatedResponseDto, any>({
        path: `/integrated-order-modification-history`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),
  }
  utilities = {
    /**
     * No description
     *
     * @name CreateUtilityHttpControllerPost
     * @request POST:/utilities
     */
    createUtilityHttpControllerPost: (data: CreateUtilityRequestDto, params: RequestParams = {}) =>
      this.request<IdResponse, any>({
        path: `/utilities`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name FindUtilityPaginatedHttpControllerGet
     * @request GET:/utilities
     */
    findUtilityPaginatedHttpControllerGet: (
      query: FindUtilityPaginatedHttpControllerGetParams,
      params: RequestParams = {},
    ) =>
      this.request<UtilityPaginatedResponseDto, any>({
        path: `/utilities`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name UpdateUtilityHttpControllerPatch
     * @request PATCH:/utilities/{utilityId}
     */
    updateUtilityHttpControllerPatch: (utilityId: string, data: UpdateUtilityRequestDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/utilities/${utilityId}`,
        method: 'PATCH',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name FindUtilityHttpControllerGet
     * @request GET:/utilities/{utilityId}
     */
    findUtilityHttpControllerGet: (utilityId: string, params: RequestParams = {}) =>
      this.request<UtilityResponseDto, any>({
        path: `/utilities/${utilityId}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name FindUtilityHistoryHttpControllerGet
     * @request GET:/utilities/histories/{utilityHistoryId}
     */
    findUtilityHistoryHttpControllerGet: (utilityHistoryId: string, params: RequestParams = {}) =>
      this.request<UtilityHistoryDetailResponseDto, any>({
        path: `/utilities/histories/${utilityHistoryId}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name FindUtilityHistoryPaginatedHttpControllerGet
     * @request GET:/utilities/{utilityId}/histories
     */
    findUtilityHistoryPaginatedHttpControllerGet: (
      { utilityId, ...query }: FindUtilityHistoryPaginatedHttpControllerGetParams,
      params: RequestParams = {},
    ) =>
      this.request<UtilityHistoryPaginatedResponseDto, any>({
        path: `/utilities/${utilityId}/histories`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),
  }
  orderedJobNotes = {
    /**
     * No description
     *
     * @name CreateJobNoteHttpControllerCreate
     * @request POST:/ordered-job-notes
     */
    createJobNoteHttpControllerCreate: (data: CreateJobNoteRequestDto, params: RequestParams = {}) =>
      this.request<CreateJobNoteResponseDto, any>({
        path: `/ordered-job-notes`,
        method: 'POST',
        body: data,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name FindJobNotesHttpControllerFind
     * @request GET:/ordered-job-notes/{jobId}
     */
    findJobNotesHttpControllerFind: (jobId: string, params: RequestParams = {}) =>
      this.request<JobNoteResponseDto, any>({
        path: `/ordered-job-notes/${jobId}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),
  }
  tasks = {
    /**
     * No description
     *
     * @name CreateTaskHttpControllerPost
     * @request POST:/tasks
     */
    createTaskHttpControllerPost: (data: CreateTaskRequestDto, params: RequestParams = {}) =>
      this.request<IdResponse, any>({
        path: `/tasks`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name FindTaskPaginatedHttpControllerGet
     * @request GET:/tasks
     */
    findTaskPaginatedHttpControllerGet: (query: FindTaskPaginatedHttpControllerGetParams, params: RequestParams = {}) =>
      this.request<TaskPaginatedResponseDto, any>({
        path: `/tasks`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name UpdateTaskHttpControllerPatch
     * @request PATCH:/tasks/{taskId}
     */
    updateTaskHttpControllerPatch: (taskId: string, data: UpdateTaskRequestDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/tasks/${taskId}`,
        method: 'PATCH',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name FindTaskHttpControllerGet
     * @request GET:/tasks/{taskId}
     */
    findTaskHttpControllerGet: (taskId: string, params: RequestParams = {}) =>
      this.request<TaskResponseDto, any>({
        path: `/tasks/${taskId}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name AddPrerequisiteTaskHttpControllerPost
     * @request POST:/tasks/{taskId}/pre-tasks
     */
    addPrerequisiteTaskHttpControllerPost: (
      taskId: string,
      data: AddPrerequisiteTaskRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/tasks/${taskId}/pre-tasks`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name DeletePrerequisiteTaskHttpControllerDelete
     * @request DELETE:/tasks/{taskId}/pre-task/{prerequisiteTaskId}
     */
    deletePrerequisiteTaskHttpControllerDelete: (
      taskId: string,
      prerequisiteTaskId: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/tasks/${taskId}/pre-task/${prerequisiteTaskId}`,
        method: 'DELETE',
        ...params,
      }),

    /**
     * No description
     *
     * @name UpdatePositionOrderHttpControllerPatch
     * @request PATCH:/tasks/{taskId}/position-order
     */
    updatePositionOrderHttpControllerPatch: (
      taskId: string,
      data: UpdatePositionOrderRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/tasks/${taskId}/position-order`,
        method: 'PATCH',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name FindUnregisteredUsersForTaskHttpControllerGet
     * @request GET:/tasks/{taskId}/unregistered-users
     */
    findUnregisteredUsersForTaskHttpControllerGet: (
      { taskId, ...query }: FindUnregisteredUsersForTaskHttpControllerGetParams,
      params: RequestParams = {},
    ) =>
      this.request<UnregisteredUserForTaskPaginatedResponseDto, any>({
        path: `/tasks/${taskId}/unregistered-users`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),
  }
  vendorInvoices = {
    /**
     * No description
     *
     * @name CreateVendorInvoiceHttpControllerPost
     * @request POST:/vendor-invoices
     */
    createVendorInvoiceHttpControllerPost: (data: CreateVendorInvoiceRequestDto, params: RequestParams = {}) =>
      this.request<IdResponse, any>({
        path: `/vendor-invoices`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name FindVendorInvoicePaginatedHttpControllerGet
     * @request GET:/vendor-invoices
     */
    findVendorInvoicePaginatedHttpControllerGet: (
      query: FindVendorInvoicePaginatedHttpControllerGetParams,
      params: RequestParams = {},
    ) =>
      this.request<VendorInvoicePaginatedResponseDto, any>({
        path: `/vendor-invoices`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name DeleteVendorInvoiceHttpControllerDelete
     * @request DELETE:/vendor-invoices/{vendorInvoiceId}
     */
    deleteVendorInvoiceHttpControllerDelete: (vendorInvoiceId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/vendor-invoices/${vendorInvoiceId}`,
        method: 'DELETE',
        ...params,
      }),

    /**
     * No description
     *
     * @name FindVendorInvoiceHttpControllerGet
     * @request GET:/vendor-invoices/{vendorInvoiceId}
     */
    findVendorInvoiceHttpControllerGet: (vendorInvoiceId: string, params: RequestParams = {}) =>
      this.request<VendorInvoiceResponseDto, any>({
        path: `/vendor-invoices/${vendorInvoiceId}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name UpdateVendorInvoiceHttpControllerPatch
     * @request PATCH:/vendor-invoices/{vendorInvoiceId}
     */
    updateVendorInvoiceHttpControllerPatch: (
      vendorInvoiceId: string,
      data: UpdateVendorInvoiceRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/vendor-invoices/${vendorInvoiceId}`,
        method: 'PATCH',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name FindVendorInvoiceLineItemHttpControllerGet
     * @request GET:/vendor-invoices/{vendorInvoiceId}/line-items
     */
    findVendorInvoiceLineItemHttpControllerGet: (
      { vendorInvoiceId, ...query }: FindVendorInvoiceLineItemHttpControllerGetParams,
      params: RequestParams = {},
    ) =>
      this.request<VendorInvoiceLineItemPaginatedResponseDto, any>({
        path: `/vendor-invoices/${vendorInvoiceId}/line-items`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name UpdateVendorInvoicedTotalHttpControllerPatch
     * @request PATCH:/vendor-invoices/{vendorInvoiceId}/total
     */
    updateVendorInvoicedTotalHttpControllerPatch: (
      vendorInvoiceId: string,
      data: UpdateVendorInvoicedTotalRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/vendor-invoices/${vendorInvoiceId}/total`,
        method: 'PATCH',
        body: data,
        type: ContentType.Json,
        ...params,
      }),
  }
  vendorToInvoices = {
    /**
     * @description 바른코프에서 외주 비용을 지불해야할 외주 회사 리스트 조회
     *
     * @name FindVendorToInvoicePaginatedHttpControllerGet
     * @request GET:/vendor-to-invoices
     */
    findVendorToInvoicePaginatedHttpControllerGet: (params: RequestParams = {}) =>
      this.request<VendorToInvoiceResponseDto, any>({
        path: `/vendor-to-invoices`,
        method: 'GET',
        format: 'json',
        ...params,
      }),
  }
  vendorToInvoiceLineItems = {
    /**
     * No description
     *
     * @name FindVendorToInvoiceLineItemsPaginatedHttpControllerGet
     * @request GET:/vendor-to-invoice-line-items
     */
    findVendorToInvoiceLineItemsPaginatedHttpControllerGet: (
      query: FindVendorToInvoiceLineItemsPaginatedHttpControllerGetParams,
      params: RequestParams = {},
    ) =>
      this.request<VendorInvoiceLineItemPaginatedResponseDto, any>({
        path: `/vendor-to-invoice-line-items`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),
  }
  vendorPayments = {
    /**
     * No description
     *
     * @name CreateVendorPaymentHttpControllerPost
     * @request POST:/vendor-payments
     */
    createVendorPaymentHttpControllerPost: (data: CreateVendorPaymentRequestDto, params: RequestParams = {}) =>
      this.request<IdResponse, any>({
        path: `/vendor-payments`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name FindVendorPaymentPaginatedHttpControllerGet
     * @request GET:/vendor-payments
     */
    findVendorPaymentPaginatedHttpControllerGet: (
      query: FindVendorPaymentPaginatedHttpControllerGetParams,
      params: RequestParams = {},
    ) =>
      this.request<VendorPaymentPaginatedResponseDto, any>({
        path: `/vendor-payments`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name CancelVendorPaymentHttpControllerPatch
     * @request PATCH:/vendor-payments/{vendorPaymentId}
     */
    cancelVendorPaymentHttpControllerPatch: (vendorPaymentId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/vendor-payments/${vendorPaymentId}`,
        method: 'PATCH',
        ...params,
      }),

    /**
     * No description
     *
     * @name FindVendorPaymentHttpControllerGet
     * @request GET:/vendor-payments/{vendorPaymentId}
     */
    findVendorPaymentHttpControllerGet: (vendorPaymentId: string, params: RequestParams = {}) =>
      this.request<VendorPaymentResponseDto, any>({
        path: `/vendor-payments/${vendorPaymentId}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),
  }
  vendorCreditTransactions = {
    /**
     * No description
     *
     * @name CreateVendorCreditTransactionHttpControllerPost
     * @request POST:/vendor-credit-transactions
     */
    createVendorCreditTransactionHttpControllerPost: (
      data: CreateVendorCreditTransactionRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<IdResponse, any>({
        path: `/vendor-credit-transactions`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name FindVendorCreditTransactionPaginatedHttpControllerGet
     * @request GET:/vendor-credit-transactions
     */
    findVendorCreditTransactionPaginatedHttpControllerGet: (
      query: FindVendorCreditTransactionPaginatedHttpControllerGetParams,
      params: RequestParams = {},
    ) =>
      this.request<VendorCreditTransactionPaginatedResponseDto, any>({
        path: `/vendor-credit-transactions`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name CancelVendorCreditTransactionHttpControllerPatch
     * @request PATCH:/vendor-credit-transactions/{vendorCreditTransactionId}/cancel
     */
    cancelVendorCreditTransactionHttpControllerPatch: (vendorCreditTransactionId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/vendor-credit-transactions/${vendorCreditTransactionId}/cancel`,
        method: 'PATCH',
        ...params,
      }),

    /**
     * No description
     *
     * @name FindVendorCreditTransactionHttpControllerGet
     * @request GET:/vendor-credit-transactions/{vendorCreditTransactionId}
     */
    findVendorCreditTransactionHttpControllerGet: (vendorCreditTransactionId: string, params: RequestParams = {}) =>
      this.request<VendorCreditTransactionResponseDto, any>({
        path: `/vendor-credit-transactions/${vendorCreditTransactionId}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name FindVendorOrganizationCreditTransactionHttpControllerGet
     * @request GET:/vendor-credit-transactions/organizations/{vendorOrganizationId}
     */
    findVendorOrganizationCreditTransactionHttpControllerGet: (
      vendorOrganizationId: string,
      params: RequestParams = {},
    ) =>
      this.request<VendorCreditOrganizationTransactionResponseDto, any>({
        path: `/vendor-credit-transactions/organizations/${vendorOrganizationId}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),
  }
  assigningTaskAlerts = {
    /**
     * No description
     *
     * @name FindAssigningTaskAlertPaginatedHttpControllerFind
     * @request GET:/assigning-task-alerts
     */
    findAssigningTaskAlertPaginatedHttpControllerFind: (
      query: FindAssigningTaskAlertPaginatedHttpControllerFindParams,
      params: RequestParams = {},
    ) =>
      this.request<AssigningTaskAlertPaginatedResponse, any>({
        path: `/assigning-task-alerts`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name CheckOutAssigningTaskAlertHttpControllerCheckOut
     * @request PATCH:/assigning-task-alerts/{assigningTaskAlertId}/check-out
     */
    checkOutAssigningTaskAlertHttpControllerCheckOut: (assigningTaskAlertId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/assigning-task-alerts/${assigningTaskAlertId}/check-out`,
        method: 'PATCH',
        ...params,
      }),
  }
  informations = {
    /**
     * No description
     *
     * @name CreateInformationHttpControllerPatch
     * @request POST:/informations
     */
    createInformationHttpControllerPatch: (data: CreateInformationRequestDto, params: RequestParams = {}) =>
      this.request<IdResponse, any>({
        path: `/informations`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name FindInformationPaginatedHttpControllerGet
     * @request GET:/informations
     */
    findInformationPaginatedHttpControllerGet: (
      query: FindInformationPaginatedHttpControllerGetParams,
      params: RequestParams = {},
    ) =>
      this.request<InformationPaginatedResponseDto, any>({
        path: `/informations`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name UpdateInformationHttpControllerPatch
     * @request PATCH:/informations/{informationId}
     */
    updateInformationHttpControllerPatch: (
      informationId: string,
      data: UpdateInformationRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/informations/${informationId}`,
        method: 'PATCH',
        body: data,
        type: ContentType.Json,
        ...params,
      }),
  }
  clientNote = {
    /**
     * No description
     *
     * @name UpdateClientNoteHttpControllerPatch
     * @request PATCH:/client-note/{organizationId}
     */
    updateClientNoteHttpControllerPatch: (
      organizationId: string,
      data: UpdateClientNoteRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/client-note/${organizationId}`,
        method: 'PATCH',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name FindClientNoteHttpControllerGet
     * @request GET:/client-note/{clientNoteId}
     */
    findClientNoteHttpControllerGet: (clientNoteId: string, params: RequestParams = {}) =>
      this.request<ClientNoteDetailResponseDto, any>({
        path: `/client-note/${clientNoteId}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name FindClientNotePaginatedHttpControllerGet
     * @request GET:/client-note
     */
    findClientNotePaginatedHttpControllerGet: (
      query: FindClientNotePaginatedHttpControllerGetParams,
      params: RequestParams = {},
    ) =>
      this.request<ClientNotePaginatedResponseDto, any>({
        path: `/client-note`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),
  }
  googleJobNoteFolder = {
    /**
     * No description
     *
     * @name CreateGoogleJobNoteFolderHttpControllerPost
     * @request POST:/google-job-note-folder
     */
    createGoogleJobNoteFolderHttpControllerPost: (
      data: CreateGoogleJobNoteFolderRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/google-job-note-folder`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),
  }
  googleAhjNoteFolder = {
    /**
     * No description
     *
     * @name CreateGoogleAhjNoteFolderHttpControllerPost
     * @request POST:/google-ahj-note-folder
     */
    createGoogleAhjNoteFolderHttpControllerPost: (
      data: CreateGoogleAhjNoteFolderRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/google-ahj-note-folder`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),
  }
  nonCountedJobFolder = {
    /**
     * No description
     *
     * @name FindNonCountedJobFoldersHttpControllerFindNonCountedJobFolders
     * @summary Find non-counted-job-folder
     * @request GET:/non-counted-job-folder
     */
    findNonCountedJobFoldersHttpControllerFindNonCountedJobFolders: (
      query: FindNonCountedJobFoldersHttpControllerFindNonCountedJobFoldersParams,
      params: RequestParams = {},
    ) =>
      this.request<JobFolderPaginatedResponseDto, any>({
        path: `/non-counted-job-folder`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),
  }
  googleSharedDriveCount = {
    /**
     * No description
     *
     * @name UpdateGoogleSharedDriveCountHttpControllerPatch
     * @request PATCH:/google-shared-drive-count
     */
    updateGoogleSharedDriveCountHttpControllerPatch: (
      data: UpdateGoogleSharedDriveCountRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/google-shared-drive-count`,
        method: 'PATCH',
        body: data,
        type: ContentType.Json,
        ...params,
      }),
  }
  couriers = {
    /**
     * No description
     *
     * @name CreateCouriersHttpControllerPost
     * @request POST:/couriers
     */
    createCouriersHttpControllerPost: (data: CreateCouriersRequestDto, params: RequestParams = {}) =>
      this.request<IdResponse, any>({
        path: `/couriers`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name FindCouriersPaginatedHttpControllerGet
     * @request GET:/couriers
     */
    findCouriersPaginatedHttpControllerGet: (
      query: FindCouriersPaginatedHttpControllerGetParams,
      params: RequestParams = {},
    ) =>
      this.request<CouriersPaginatedResponseDto, any>({
        path: `/couriers`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name UpdateCouriersHttpControllerPatch
     * @request PATCH:/couriers/{couriersId}
     */
    updateCouriersHttpControllerPatch: (
      couriersId: string,
      data: UpdateCouriersRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/couriers/${couriersId}`,
        method: 'PATCH',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name DeleteCouriersHttpControllerPatch
     * @request DELETE:/couriers/{couriersId}
     */
    deleteCouriersHttpControllerPatch: (couriersId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/couriers/${couriersId}`,
        method: 'DELETE',
        ...params,
      }),
  }
  trackingNumbers = {
    /**
     * No description
     *
     * @name CreateTrackingNumbersHttpControllerPost
     * @request POST:/tracking-numbers
     */
    createTrackingNumbersHttpControllerPost: (data: CreateTrackingNumbersRequestDto, params: RequestParams = {}) =>
      this.request<IdResponse, any>({
        path: `/tracking-numbers`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name FindTrackingNumbersPaginatedHttpControllerGet
     * @request GET:/tracking-numbers
     */
    findTrackingNumbersPaginatedHttpControllerGet: (
      query: FindTrackingNumbersPaginatedHttpControllerGetParams,
      params: RequestParams = {},
    ) =>
      this.request<TrackingNumbersPaginatedResponseDto, any>({
        path: `/tracking-numbers`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name UpdateTrackingNumbersHttpControllerPatch
     * @request PATCH:/tracking-numbers/{trackingNumberId}
     */
    updateTrackingNumbersHttpControllerPatch: (
      trackingNumberId: string,
      data: UpdateTrackingNumbersRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/tracking-numbers/${trackingNumberId}`,
        method: 'PATCH',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name DeleteTrackingNumbersHttpControllerPatch
     * @request DELETE:/tracking-numbers/{trackingNumberId}
     */
    deleteTrackingNumbersHttpControllerPatch: (trackingNumberId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/tracking-numbers/${trackingNumberId}`,
        method: 'DELETE',
        ...params,
      }),
  }
}
