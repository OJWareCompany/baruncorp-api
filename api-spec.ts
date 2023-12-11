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
  /** @default "ejsvk3284@kakao.com" */
  email: string
  /** @default "WkdWkdaos123!" */
  password: string
}

export interface TokenResponseDto {
  accessToken: string
  refreshToken: string
}

export interface SignUpRequestDto {
  /** @default "Emma" */
  firstName: string
  /** @default "Smith" */
  lastName: string
  /** @default "hyomin@ojware.com" */
  email: string
  /** @default false */
  isVendor: boolean
  /** @default "hyomin@ojware.com" */
  deliverablesEmails: string[]
  /** @default "thisistestPass123!" */
  password: string
  /** @default "AE2DE" */
  code: string
  /** @default "176 Morningmist Road, Naugatuck, Connecticut 06770" */
  address: string | null
  /** @default "857-250-4567" */
  phoneNumber: string
}

export interface SignUpTestRequestDto {
  /** @default "Emma" */
  name: string
  /** @default "hyomin@ojware.com" */
  email: string
}

export interface AccessTokenResponseDto {
  accessToken: string
}

export interface UserPositionResponseDto {
  id: string
  name: string
}

export interface RelatedTaskResponseDto {
  /** @default "" */
  id: string
  /** @default "" */
  name: string
}

export interface UserServiceResponseDto {
  id: string
  name: string
  billingCode: string
  basePrice: number
  relatedTasks: RelatedTaskResponseDto[]
}

export interface LincenseResponseDto {
  type: 'Electrical' | 'Structural'
  ownerName: string
  issuingCountryName: string
  abbreviation: string
  priority: number | null
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
  services: UserServiceResponseDto[]
  licenses: LincenseResponseDto[]
  role: string
  deliverablesEmails: string[]
}

export interface UpdateUserRequestDto {
  /** @default "updated Hyomin" */
  firstName: string
  /** @default "updated Kim" */
  lastName: string
  /** @default "hyomin@ojware.com" */
  deliverablesEmails: string[]
  /** @default "857-250-4567" */
  phoneNumber: string | null
}

export interface GiveRoleRequestDto {
  /** @default "96d39061-a4d7-4de9-a147-f627467e11d5" */
  userId: string
}

export interface CreateInvitationMailRequestDto {
  /** @default "OJ Tech" */
  organizationName: string
  /** @default "hyomin@ojware.com" */
  email: string
}

export interface CreateLicenseRequestDto {
  /** @default "96d39061-a4d7-4de9-a147-f627467e11d5" */
  userId: string
  /** @default "Electrical" */
  type: 'Electrical' | 'Structural'
  /** @default "FLORIDA" */
  issuingCountryName: string
  /** @default "FL" */
  abbreviation: string
  /** @default 9 */
  priority: number
  /** @default "2023-09-04T07:31:27.217Z" */
  expiryDate: string | null
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
  email: string | null
  phoneNumber: string | null
  organizationType: string
  address: AddressDto
  projectPropertyTypeDefaultValue: string | null
  mountingTypeDefaultValue: string | null
  isSpecialRevisionPricing: boolean
  numberOfFreeRevisionCount: number | null
}

export interface OrganizationPaginatedResponseFields {
  id: string
  fullAddress: string
  name: string
  description: string | null
  email: string | null
  phoneNumber: string | null
  organizationType: string
  projectPropertyTypeDefaultValue: string | null
  mountingTypeDefaultValue: string | null
  isSpecialRevisionPricing: boolean
  numberOfFreeRevisionCount: number | null
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
  /** @default "hyomin@ojware.com" */
  email: string | null
  /** @default true */
  isVendor: boolean
  address: AddressDto
  /** @default "01012341234" */
  phoneNumber: string | null
  /** @default "OJ Tech" */
  name: string
  /** @default "This is about organization..." */
  description: string | null
  /**
   * @default "client"
   * @pattern /(client|individual|outsourcing)/
   */
  organizationType: string
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
  /** @default "hyomin@ojware.com" */
  email: string | null
  address: AddressDto
  /** @default "01012341234" */
  phoneNumber: string | null
  /** @default "This is about organization..." */
  description: string | null
  /** @default "Commercial" */
  projectPropertyTypeDefaultValue: 'Residential' | 'Commercial' | null
  /** @default "Roof Mount" */
  mountingTypeDefaultValue: 'Roof Mount' | 'Ground Mount' | null
  /** @default false */
  isSpecialRevisionPricing: boolean
  /** @default 2 */
  numberOfFreeRevisionCount: number | null
}

export interface PositionResponseDto {
  id: string
  name: string
  description: string | null
  department: string
}

export interface StatesResponseDto {
  /** @default "CALIFORNIA" */
  stateName: string
  /** @default "CA" */
  abbreviation: string | null
  /** @default "06" */
  geoId: string | null
  /** @default "06" */
  stateCode: string | null
  /** @default "01779778" */
  ansiCode: string | null
  /** @default "California" */
  stateLongName: string | null
}

export interface AhjNoteListResponseDto {
  geoId: string
  name: string
  fullAhjName: string
  updatedBy: string
  updatedAt: string
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
  windSpeed: string | null
  /** @default "See Notes" */
  windExposure: 'B' | 'C' | 'D' | 'See Notes' | null
  /** @default "30" */
  snowLoadGround: string | null
  /** @default "30" */
  snowLoadFlatRoof: string | null
  /** @default "See Notes" */
  wetStampsRequired: 'No' | 'Yes' | 'See Notes' | null
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
}

export interface UpdateAhjNoteRequestDto {
  general: UpdateAhjGeneral
  design: Design
  engineering: Engineering
  electricalEngineering: ElectricalEngineering
}

export interface AhjNoteHistoryResponseDto {
  id: number
  general: General
  design: Design
  engineering: Engineering
  electricalEngineering: ElectricalEngineering
}

export interface AhjNoteHistoryListResponseDto {
  id: number
  geoId: string
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
}

export interface UpdateProjectRequestDto {
  /** @default "Residential" */
  projectPropertyType: 'Residential' | 'Commercial'
  /** @default "Chris Kim" */
  projectPropertyOwner: string | null
  /** @default "50021" */
  projectNumber: string | null
  projectPropertyAddress: AddressDto
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

export interface AssignedTaskResponseFields {
  assignTaskId: string
  /** @example "Not Started" */
  status: 'Not Started' | 'In Progress' | 'On Hold' | 'Canceled' | 'Completed'
  taskName: string
  taskId: string
  orderedServiceId: string
  startedAt: string | null
  assigneeName: string | null
  assigneeId: string | null
  doneAt: string | null
  description: string | null
}

export interface OrderedServiceResponseFields {
  orderedServiceId: string
  serviceId: string
  sizeForRevision: 'Major' | 'Minor' | null
  serviceName: string
  isRevision: boolean
  description: string | null
  price: number | null
  priceOverride: number | null
  /** @example "Pending" */
  status: 'Pending' | 'Completed' | 'Canceled'
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
  propertyType: 'Residential' | 'Commercial'
  billingCodes: string[]
  taskSizeForRevision: 'Major' | 'Minor' | null
  /** @example 300.1 */
  systemSize: number | null
  mailingAddressForWetStamp: AddressDto | null
  /** @example "Ground Mount" */
  mountingType: string
  /** @example 3 */
  numberOfWetStamp: number | null
  /** @example "Please check this out." */
  additionalInformationFromClient: string | null
  /** @example "Chris Kim" */
  updatedBy: string
  /** @example "176 Morningmist Road, Naugatuck, Connecticut 06770" */
  propertyFullAddress: string
  /** @example 5 */
  jobRequestNumber: number
  /** @example "In Progress" */
  jobStatus: 'Not Started' | 'In Progress' | 'On Hold' | 'Completed' | 'Canceled'
  /** @example "Residential" */
  projectType: string
  assignedTasks: AssignedTaskResponseFields[]
  orderedServices: OrderedServiceResponseFields[]
  clientInfo: ClientInformationFields
  /** @example "2023-08-11 09:10:31" */
  receivedAt: string
  /** @example true */
  isExpedited: boolean
  jobName: string
  isCurrentJob?: boolean
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
  /** @example [] */
  jobs: JobResponseDto[]
}

export interface CreateOrderedTaskWhenJobIsCreatedRequestDto {
  serviceId: string
  description: string | null
}

export interface CreateJobRequestDto {
  /** @default "chris@barun.com" */
  deliverablesEmails: string[]
  /** @default "07ec8e89-6877-4fa1-a029-c58360b57f43" */
  clientUserId: string
  /** @default "please, check this out." */
  additionalInformationFromClient: string | null
  /** @default 300.1 */
  systemSize: number | null
  /** @default "561f7c64-fe49-40a4-8399-d5d24725f9cd" */
  projectId: string
  /** @example "Ground Mount" */
  mountingType: 'Roof Mount' | 'Ground Mount'
  /** @default [{"serviceId":"e5d81943-3fef-416d-a85b-addb8be296c0","description":""},{"serviceId":"9e773832-ad39-401d-b1c2-16d74f9268ea","description":""},{"serviceId":"99ff64ee-fe47-4235-a026-db197628d077","description":""},{"serviceId":"5c29f1ae-d50b-4400-a6fb-b1a2c87126e9","description":""},{"serviceId":"2a2a256b-57a5-46f5-8cfb-1855cc29238a","description":"This is not on the menu."}] */
  taskIds: CreateOrderedTaskWhenJobIsCreatedRequestDto[]
  mailingAddressForWetStamp: AddressDto | null
  /** @default 3 */
  numberOfWetStamp: number | null
  /** @default false */
  isExpedited: boolean
}

export interface UpdateJobRequestDto {
  /** @default "chris@barun.com" */
  deliverablesEmails: string[]
  /** @default "07ec8e89-6877-4fa1-a029-c58360b57f43" */
  clientUserId: string
  /** @default "please, check this out." */
  additionalInformationFromClient: string | null
  /** @default 300.1 */
  systemSize: number | null
  mailingAddressForWetStamp: AddressDto | null
  /** @default 3 */
  numberOfWetStamp: number | null
  /** @default true */
  isExpedited: boolean
  /** @default "Roof Mount" */
  mountingType: string
}

export interface JobPaginatedResponseFields {
  /** @example "5c29f1ae-d50b-4400-a6fb-b1a2c87126e9" */
  id: string
  /** @example "176 Morningmist Road, Naugatuck, Connecticut 06770" */
  propertyFullAddress: string
  /** @example 5 */
  jobRequestNumber: number
  /** @example "In Progress" */
  jobStatus: 'Not Started' | 'In Progress' | 'On Hold' | 'Completed' | 'Canceled'
  /** @example "Residential" */
  projectType: string
  /** @example "Ground Mount" */
  mountingType: string
  orderedServices: OrderedServiceResponseFields[]
  assignedTasks: AssignedTaskResponseFields[]
  clientInfo: ClientInformationFields
  /** @example "2023-08-11 09:10:31" */
  receivedAt: string
  /** @example true */
  isExpedited: boolean
  /** @example "Please check this out." */
  additionalInformationFromClient: string | null
  jobName: string
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
  items: JobPaginatedResponseFields[]
}

export interface InvoiceClientOrganization {
  id: string
  name: string
}

export interface LineItem {
  jobId: string
  /** @example 5 */
  jobRequestNumber: number
  description: string
  /** @format date-time */
  dateSentToClient: string
  mountingType: 'Roof Mount' | 'Ground Mount'
  clientOrganization: InvoiceClientOrganization
  isContainsRevisionTask: boolean
  propertyType: 'Residential' | 'Commercial'
  state: string
  billingCodes: string[]
  taskSizeForRevision: 'Major' | 'Minor' | null
  pricingType: 'Standard' | 'Tiered'
  price: number
  taskSubtotal: number
}

export interface JobToInvoiceResponseDto {
  items: LineItem[]
  subtotal: number
  discount: number
  total: number
}

export interface CreateJobNoteRequestDto {
  /** @default "what do you think about Jazz?" */
  content: string
  /** @default "hs8da-cdef-gh22321ask-xzcm12e3" */
  jobId: string
}

export interface JobNoteResponseDto {
  jobNoteId: string
  /** @example "what do you think about Jazz?" */
  content: string
  jobId: string
  commenterName: string
  commenterUserId: string
  createdAt: string
}

export interface JobNoteListResponseDto {
  notes: JobNoteResponseDto[]
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
}

export interface TaskResponseDto {
  /** @default "" */
  id: string
  /** @default "" */
  serviceId: string
  /** @default "" */
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
  relatedTasks: TaskResponseDto[]
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
  price: number | null
  priceOrverride: number | null
  jobId: string
  /** @default "Completed" */
  status: 'Pending' | 'Completed' | 'Canceled' | null
  orderedAt: string | null
  doneAt: string | null
  isRevision: boolean
  assignedTasks: OrderedServiceAssignedTaskResponse[]
}

export interface UpdateManualPriceRequestDto {
  /** @default "" */
  price: number
}

export interface UpdateRevisionSizeRequestDto {
  /** @default null */
  sizeForRevision: 'Major' | 'Minor' | null
}

export interface CreateTaskRequestDto {
  /** @default "618d6167-0cff-4c0f-bbf6-ed7d6e14e2f1" */
  serviceId: string
  /** @default "PV Design QA/QC" */
  name: string
}

export interface UpdateTaskRequestDto {
  /** @default "" */
  name: string
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
  items: TaskResponseDto[]
}

export interface UpdateAssignedTaskRequestDto {
  /** @default null */
  assigneeId: string
}

export interface AssignedTaskResponseDto {
  id: string
  taskId: string
  taskName: string
  orderedServiceId: string
  serviceName: string
  jobId: string
  /** @default "Not Started" */
  status: 'Not Started' | 'In Progress' | 'On Hold' | 'Canceled' | 'Completed'
  description: string | null
  assigneeId: string | null
  assigneeName: string | null
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
  duration: number | null
  cost: number | null
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

export interface UpdateTaskDurationRequestDto {
  /** @default null */
  duration: number | null
}

export interface CreateInvoiceRequestDto {
  /**
   * @format date-time
   * @default "2023-10-01T05:14:33.599Z"
   */
  invoiceDate: string
  terms: 21 | 30
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
  terms: 21 | 30
  notesToClient: string | null
}

export interface InvoicePayments {
  id: string
  paymentName: string
  invoiceId: string
  amount: number
  paymentMethod: 'Credit' | 'Direct'
  notes: string | null
  paymentDate: string
  canceledAt: string | null
}

export interface InvoiceResponseDto {
  id: string
  invoiceName: string
  status: 'Unissued' | 'Issued' | 'Paid'
  invoiceDate: string
  terms: 21 | 30
  dueDate: string
  notesToClient: string | null
  createdAt: string
  updatedAt: string
  servicePeriodDate: string
  subtotal: number
  discount: number | null
  total: number
  clientOrganization: InvoiceClientOrganization
  lineItems: LineItem[]
  payments: InvoicePayments[]
  totalOfPayment: number
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

export interface CreatePaymentRequestDto {
  invoiceId: string
  /** @default 100 */
  amount: number
  paymentMethod: 'Credit' | 'Direct'
  notes: string | null
}

export interface PaymentResponseDto {
  id: string
  invoiceId: string
  amount: number
  paymentMethod: 'Credit' | 'Direct'
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

export interface Tier {
  /** @default 0.01 */
  startingPoint: number
  /** @default 100 */
  finishingPoint: number
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

export interface CreateExpensePricingRequestDto {
  taskId: string
  organizationId: string
  resiNewExpenseType: string
  resiNewValue: number
  resiRevExpenseType: string
  resiRevValue: number
  comNewExpenseType: string
  comNewValue: number
  comRevExpenseType: string
  comRevValue: number
}

export interface UpdateExpensePricingRequestDto {
  resiNewExpenseType: string
  resiNewValue: number
  resiRevExpenseType: string
  resiRevValue: number
  comNewExpenseType: string
  comNewValue: number
  comRevExpenseType: string
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

export interface AuthenticationControllerPostSignInTimeParams {
  /** @default 20 */
  jwt: number
  /** @default 40 */
  refresh: number
}

export interface FindUsersHttpControllerGetFindUsersParams {
  /** @default "hyomin@ojware.com" */
  email?: string | null
  /** @default "" */
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

export interface FindOrganizationPaginatedHttpControllerGetOrganizationPaginatedParams {
  name?: string | null
  fullAddress?: string | null
  email?: string | null
  phoneNumber?: string | null
  organizationType?: string | null
  projectPropertyTypeDefaultValue?: string | null
  mountingTypeDefaultValue?: string | null
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
  /** @default "city" */
  fullAhjName?: string | null
  /** @default "city" */
  name?: string | null
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

export interface FindProjectsHttpControllerFindUsersParams {
  /** @default "Residential" */
  propertyType?: string | null
  /** @default null */
  projectNumber?: string | null
  /** @default "3480 Northwest 33rd Court" */
  propertyFullAddress?: string | null
  /** @default "" */
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

export interface FindJobPaginatedHttpControllerFindJobParams {
  /** @default "Residential" */
  propertyType?: string | null
  /** @default "3480 Northwest 33rd Court" */
  jobName?: string | null
  /** @default "" */
  projectId?: string | null
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

export interface FindMyActiveJobPaginatedHttpControllerFindJobParams {
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

export interface FindAssignedTaskPaginatedHttpControllerGetParams {
  /** @default "" */
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
     * @name AuthenticationControllerPostSignUp
     * @request POST:/auth/signup
     */
    authenticationControllerPostSignUp: (data: SignUpRequestDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/auth/signup`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name AuthenticationControllerPostSignUpTest
     * @request POST:/auth/signup-test
     */
    authenticationControllerPostSignUpTest: (data: SignUpTestRequestDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/auth/signup-test`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
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
      this.request<void, any>({
        path: `/users/roles`,
        method: 'GET',
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
     * @name UsersControllerPostSendInvitationMail
     * @request POST:/users/invitations
     */
    usersControllerPostSendInvitationMail: (data: CreateInvitationMailRequestDto, params: RequestParams = {}) =>
      this.request<object, any>({
        path: `/users/invitations`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description 등록된 모든 라이센스 조회 라이센스: 특정 State에서 작업 허가 받은 Member의 자격증
     *
     * @name UsersControllerPostRegisterMemberLicense
     * @request POST:/users/member-licenses
     */
    usersControllerPostRegisterMemberLicense: (data: CreateLicenseRequestDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/users/member-licenses`,
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
  departments = {
    /**
     * No description
     *
     * @name DepartmentControllerGetFindAllPositions
     * @request GET:/departments/positions
     */
    departmentControllerGetFindAllPositions: (params: RequestParams = {}) =>
      this.request<PositionResponseDto[], any>({
        path: `/departments/positions`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name DepartmentControllerGetFindAllStates
     * @request GET:/departments/states
     */
    departmentControllerGetFindAllStates: (params: RequestParams = {}) =>
      this.request<StatesResponseDto[], any>({
        path: `/departments/states`,
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
     * @request GET:/geography/notes/history/{historyId}
     * @secure
     */
    geographyControllerGetFinNoteUpdateHistoryDetail: (historyId: number, params: RequestParams = {}) =>
      this.request<AhjNoteHistoryResponseDto, any>({
        path: `/geography/notes/history/${historyId}`,
        method: 'GET',
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
     * @name CancelJobHttpControllerUpdateJob
     * @request PATCH:/jobs/cancel/{jobId}
     */
    cancelJobHttpControllerUpdateJob: (jobId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/jobs/cancel/${jobId}`,
        method: 'PATCH',
        ...params,
      }),

    /**
     * No description
     *
     * @name HoldJobHttpControllerUpdateJob
     * @request PATCH:/jobs/hold/{jobId}
     */
    holdJobHttpControllerUpdateJob: (jobId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/jobs/hold/${jobId}`,
        method: 'PATCH',
        ...params,
      }),
  }
  myActiveJobs = {
    /**
     * No description
     *
     * @name FindMyActiveJobPaginatedHttpControllerFindJob
     * @summary Find My active jobs.
     * @request GET:/my-active-jobs
     */
    findMyActiveJobPaginatedHttpControllerFindJob: (
      query: FindMyActiveJobPaginatedHttpControllerFindJobParams,
      params: RequestParams = {},
    ) =>
      this.request<JobPaginatedResponseDto, any>({
        path: `/my-active-jobs`,
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
  orderedJobNotes = {
    /**
     * No description
     *
     * @name CreateJobNoteHttpControllerCreate
     * @request POST:/ordered-job-notes
     */
    createJobNoteHttpControllerCreate: (data: CreateJobNoteRequestDto, params: RequestParams = {}) =>
      this.request<IdResponse, any>({
        path: `/ordered-job-notes`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
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
      this.request<JobNoteListResponseDto, any>({
        path: `/ordered-job-notes/${jobId}`,
        method: 'GET',
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
     * @name CancelOrderedServiceHttpControllerPatch
     * @request PATCH:/ordered-services/cancel/{orderedServiceId}
     */
    cancelOrderedServiceHttpControllerPatch: (orderedServiceId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/ordered-services/cancel/${orderedServiceId}`,
        method: 'PATCH',
        ...params,
      }),

    /**
     * No description
     *
     * @name ReactivateOrderedServiceHttpControllerPatch
     * @request PATCH:/ordered-services/reactivate/{orderedServiceId}
     */
    reactivateOrderedServiceHttpControllerPatch: (orderedServiceId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/ordered-services/reactivate/${orderedServiceId}`,
        method: 'PATCH',
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
     * @name DeleteTaskHttpControllerDelete
     * @request DELETE:/tasks/{taskId}
     */
    deleteTaskHttpControllerDelete: (taskId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/tasks/${taskId}`,
        method: 'DELETE',
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
  }
  assignedTasks = {
    /**
     * No description
     *
     * @name UpdateAssignedTaskHttpControllerPatch
     * @request PATCH:/assigned-tasks/{assignedTaskId}
     */
    updateAssignedTaskHttpControllerPatch: (
      assignedTaskId: string,
      data: UpdateAssignedTaskRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/assigned-tasks/${assignedTaskId}`,
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
  payments = {
    /**
     * No description
     *
     * @name CreatePaymentHttpControllerPost
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
}
