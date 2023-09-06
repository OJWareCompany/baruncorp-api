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
  /**
   * 필요한지 확인 필요
   * @default true
   */
  isActiveWorkResource: boolean
  /**
   * 필요한지 확인 필요
   * @default true
   */
  isCurrentUser: boolean
  /**
   * 필요한지 확인 필요
   * @default true
   */
  isInactiveOrganizationUser: boolean
  /**
   * 필요한지 확인 필요
   * @default true
   */
  isRevenueShare: boolean
  /**
   * 필요한지 확인 필요
   * @default true
   */
  isRevisionRevenueShare: boolean
  /**
   * 필요한지 확인 필요
   * @default "CLIENT"
   */
  type: string
}

export interface AccessTokenResponseDto {
  accessToken: string
}

export interface PositionResponseDto {
  id: string
  name: string
  description: string | null
  department: string
}

export interface ServiceResponseDto {
  /** @default "9e773832-ad39-401d-b1c2-16d74f9268ea" */
  id: string
  /** @default "Structural Calculation" */
  name: string
  /** @default "Structural Calculation is service..." */
  description: string | null
}

export interface LincenseResponseDto {
  userName: string
  type: 'Electrical' | 'Structural'
  issuingCountryName: string
  abbreviation: string
  priority: number
  expiryDate: string | null
}

export interface UserResponseDto {
  id: string
  email: string
  firstName: string
  lastName: string
  fullName: string
  organization: string | null
  organizationId: string | null
  position: PositionResponseDto | null
  services: ServiceResponseDto[]
  licenses: LincenseResponseDto[]
  role: string
  deliverablesEmails: string[]
}

export interface UpdateUserRequestDto {
  /** @default "updated Hyomin" */
  firstName: string
  /** @default "updated Kim" */
  lastName: string
}

export interface GiveRoleRequestDto {
  /** @default "96d39061-a4d7-4de9-a147-f627467e11d5" */
  userId: string
  /** @default "member" */
  lol: string
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

export interface OrganizationResponseDto {
  id: string
  name: string
  description: string | null
  email: string
  phoneNumber: string
  organizationType: string
  city: string
  country: string
  postalCode: string
  state: string
  street1: string
  street2: string | null
  /** 필요한지 확인 필요 */
  isActiveContractor: boolean | null
  /** 필요한지 확인 필요 */
  isActiveWorkResource: boolean | null
  /** 필요한지 확인 필요 */
  isRevenueShare: boolean | null
  /** 필요한지 확인 필요 */
  isRevisionRevenueShare: boolean | null
  /** 필요한지 확인 필요 */
  invoiceRecipient: string | null
  /** 필요한지 확인 필요 */
  invoiceRecipientEmail: string | null
}

export interface CreateOrganizationRequestDto {
  /** @default "hyomin@ojware.com" */
  email: string
  /** @default "3480 Northwest 33rd Court, Lauderdale Lakes, Florida 33309" */
  fullAddress: string
  /** @default "3480 Northwest 33rd Court" */
  street1: string
  /** @default null */
  street2: string | null
  /** @default "Lauderdale Lakes" */
  city: string
  /** @default "Florida" */
  state: string
  /** @default "33309" */
  postalCode: string
  /** @default "United States" */
  country: string
  /** @default "01012341234" */
  phoneNumber: string
  /** @default "OJ Tech" */
  name: string
  /** @default "This is about organization..." */
  description: string | null
  /**
   * @default "client"
   * @pattern /(client|individual|outsourcing)/
   */
  organizationType: string
  /**
   * 필요한지 확인 필요
   * @default true
   */
  isActiveContractor: boolean
  /**
   * 필요한지 확인 필요
   * @default true
   */
  isActiveWorkResource: boolean
  /**
   * 필요한지 확인 필요
   * @default true
   */
  isRevenueShare: boolean
  /**
   * 필요한지 확인 필요
   * @default true
   */
  isRevisionRevenueShare: boolean
  /**
   * 필요한지 확인 필요
   * @default "chris kim"
   */
  invoiceRecipient: string
  /**
   * 필요한지 확인 필요
   * @default "chriskim@gmail.com"
   */
  invoiceRecipientEmail: string
}

export interface CreateMemberPositionRequestDto {
  /** @default "3696b9c7-916d-4812-871e-976c03a06d7e" */
  positionId: string
  /** @default "96d39061-a4d7-4de9-a147-f627467e11d5" */
  userId: string
}

export interface StatesResponseDto {
  /** @default "CALIFORNIA" */
  stateName: string
  /** @default "CA" */
  abbreviation: string | null
  /** @default "06" */
  geoId: string
  /** @default "06" */
  stateCode: string
  /** @default "01779778" */
  ansiCode: string | null
  /** @default "California" */
  stateLongName: string | null
}

export interface CreateMemberInChargeOfTheServiceRequestDto {
  /** @default "96d39061-a4d7-4de9-a147-f627467e11d5" */
  userId: string
  /** @default "a061c441-be8c-4bcc-9bcc-2460a01d5a16" */
  serviceId: string
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
  /** @default [12.1,22.2] */
  coordinates: string[]
}

export interface AddressRequestDto {
  /** @default "3480 Northwest 33rd Court" */
  street1: string
  /** @default null */
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
  projectPropertyAddress: AddressRequestDto
  /** @default [12.1,22.2] */
  coordinates: string[]
}

export interface ProjectAssociatedRegulatoryBody {
  /** @default "12" */
  stateId: string
  /** @default "12011" */
  countyId: string
  /** @default "1201191098" */
  countySubdivisionsId: string
  /** @default "1239525" */
  placeId: string
  /** @default "1239525" */
  ahjId: string
}

export interface UpdateProjectRequestDto {
  /** @default "Residential" */
  projectPropertyType: 'Residential' | 'Commercial'
  /** @default "Chris Kim" */
  projectPropertyOwner: string | null
  /** @default "50021" */
  projectNumber: string | null
  projectPropertyAddress: AddressRequestDto
  projectAssociatedRegulatory: ProjectAssociatedRegulatoryBody
  /** @default "07ec8e89-6877-4fa1-a029-c58360b57f43" */
  clientUserId: string
}

export interface ProjectPaginatedResponseFields {
  /** @example "96d39061-a4d7-4de9-a147-f627467e11d5" */
  projectId: string
  /** @example "Residential" */
  propertyType: string
  /** @example "https://host.com/projects/path" */
  projectFolderLink: string | null
  /** @example null */
  projectNumber: string | null
  /** @example "3480 Northwest 33rd Court, Lauderdale Lakes, Florida 33309" */
  propertyAddress: string
  /** @example "Ground Mount" */
  mountingType: 'Roof Mount' | 'Ground Mount' | 'Roof Mount & Ground Mount'
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

export interface OrderedTask {
  id: string
  isNewTask: boolean
  isLocked: boolean
  taskStatus: string
  taskName: string
  taskId: string
  jobId: string
  projectId: string
  /** @format date-time */
  dateCreated: string
  assigneeName: string
  assigneeUserId: string
  description: string
}

export interface ClientInformation {
  clientOrganizationId: string
  clientOrganizationName: string
  clientContactEmail: string
  deliverablesEmail: string[]
}

export interface Jobs {
  projectId: string
  mountingType: string
  jobName: string
  jobStatus: object
  propertyAddress: string
  jobRequestNumber: number
  orderedTasks: OrderedTask[]
  systemSize: number
  mailingAddressForWetStamp: string
  numberOfWetStamp: number
  additionalInformationFromClient: string
  clientInfo: ClientInformation
  updatedBy: string
  /** @format date-time */
  receivedAt: string
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
  mountingType: 'Roof Mount' | 'Ground Mount' | 'Roof Mount & Ground Mount'
  /** @example "Barun Corp" */
  clientOrganization: string
  /** @example "eaefe251-0f1f-49ac-88cb-3582ec76601d" */
  clientOrganizationId: string
  /** @example "07ec8e89-6877-4fa1-a029-c58360b57f43" */
  clientUserId: string
  /** @example "Chris Kim" */
  clientUserName: string
  /** @example "https://host.com/projects/path" */
  projectFolderLink: string | null
  /** @example "3480 Northwest 33rd Court, Lauderdale Lakes, Florida 33309" */
  mailingAddressForWetStamp: string | null
  /** @example [11.2,22.1] */
  coordinates: number[]
  /** @example "3480 Northwest 33rd Court, Lauderdale Lakes, Florida 33309" */
  propertyAddress: string
  /** @example 3 */
  numberOfWetStamp: number | null
  /** @example "Residential" */
  propertyType: object
  /** @example null */
  projectNumber: string | null
  /** @example "2023-09-05T07:14:57.270Z" */
  createdAt: string
  /** @example 1 */
  totalOfJobs: number
  /** @example false */
  masterLogUpload: boolean
  /** @example false */
  designOrPEStampPreviouslyDoneOnProjectOutSide: boolean
  /** @example [] */
  jobs: Jobs[]
}

export interface CreateOrderedTaskWhenJobIsCreatedRequestDto {
  taskId: string
  description: string | null
}

export interface CreateJobRequestDto {
  /** @default "chris@barun.com" */
  deliverablesEmails: string[]
  /** @default "07ec8e89-6877-4fa1-a029-c58360b57f43" */
  clientUserIds: string[]
  /** @default "please, check this out." */
  additionalInformationFromClient: string | null
  /** @default 300.1 */
  systemSize: number | null
  /** @default "39027356-b928-4b8e-b30c-a343a0894766" */
  projectId: string
  /** @example "Ground Mount" */
  mountingType: 'Roof Mount' | 'Ground Mount' | 'Roof Mount & Ground Mount'
  /** @default [{"taskId":"e5d81943-3fef-416d-a85b-addb8be296c0","description":""},{"taskId":"9e773832-ad39-401d-b1c2-16d74f9268ea","description":""},{"taskId":"99ff64ee-fe47-4235-a026-db197628d077","description":""},{"taskId":"5c29f1ae-d50b-4400-a6fb-b1a2c87126e9","description":""},{"taskId":"2a2a256b-57a5-46f5-8cfb-1855cc29238a","description":"This is not on the menu."}] */
  taskIds: CreateOrderedTaskWhenJobIsCreatedRequestDto[]
  /** @default "3480 Northwest 33rd Court, Lauderdale Lakes, Florida 33309" */
  mailingAddressForWetStamp: string | null
  /** @default 3 */
  numberOfWetStamp: number | null
}

export interface UpdateJobRequestDto {
  /** @default "chris@barun.com" */
  deliverablesEmails: string[]
  /** @default "On Hold" */
  jobStatus: string
  /** @default "07ec8e89-6877-4fa1-a029-c58360b57f43" */
  clientUserIds: string[]
  /** @default "please, check this out." */
  additionalInformationFromClient: string | null
  /** @default 300.1 */
  systemSize: number | null
  /** @default "3480 Northwest 33rd Court, Lauderdale Lakes, Florida 33309" */
  mailingAddressForWetStamp: string | null
  /** @default 3 */
  numberOfWetStamp: number | null
  /** @default "Roof Mount" */
  mountingType: string
}

export interface MemberResponseFields {
  /** @example "5c29f1ae-d50b-4400-a6fb-b1a2c87126e9" */
  userId: string | null
  /** @example "Chris Kim" */
  name: string | null
}

export interface OrderedTaskResponseFields {
  /** @example "5c29f1ae-d50b-4400-a6fb-b1a2c87126e9" */
  id: string
  /** @example "Not Started" */
  taskStatus: string
  /** @example "PV Design" */
  taskName: string
  assigneeName: MemberResponseFields
  /** @example null */
  description: string | null
}

export interface ClientInformationFields {
  /** @example "5c29f1ae-d50b-4400-a6fb-b1a2c87126e9" */
  clientOrganizationId: string
  /** @example "Barun Corp" */
  clientOrganizationName: string
  /** @example "gyals0386@gmail.com" */
  contactEmail: string
  /** @example "gyals0386@gmail.com" */
  deliverablesEmails: string[]
}

export interface JobResponseDto {
  /** @example "5c29f1ae-d50b-4400-a6fb-b1a2c87126e9" */
  projectId: string
  /** @example 300.1 */
  systemSize: number | null
  /** @example "176 Morningmist Road, Naugatuck, Connecticut 06770" */
  mailingAddressForWetStamp: string | null
  /** @example "Ground Mount" */
  mountingType: string
  /** @example 3 */
  numberOfWetStamp: number | null
  /** @example "Please check this out." */
  additionalInformationFromClient: string | null
  /** @example "Chris Kim" */
  updatedBy: string
  /** @example "176 Morningmist Road, Naugatuck, Connecticut 06770" */
  propertyAddress: string
  /** @example 5 */
  jobRequestNumber: number | null
  /** @example "In Progess" */
  jobStatus: string
  /** @example "Residential" */
  projectType: string
  orderedTasks: OrderedTaskResponseFields[]
  clientInfo: ClientInformationFields
  /** @example "2023-08-11 09:10:31" */
  receivedAt: string
}

export interface CreateOrderedTaskRequestDto {
  /** @default "e5d81943-3fef-416d-a85b-addb8be296c0" */
  taskMenuId: string
  /** @default "f64d7b09-e51c-4dcb-bb8e-810f66e0cacf" */
  jobId: string
  /** @default "" */
  assignedUserId: string | null
  /** @default "added task" */
  description: string | null
}

export interface CreateJobNoteRequestDto {
  /** @default "what do you think about Jazz?" */
  content: string
  /** @default "hs8da-cdef-gh22321ask-xzcm12e3" */
  jobId: string
}

export interface FindJobNotesRequestDto {
  jobId: string
}

export interface AuthenticationControllerPostSignInTimeParams {
  /** @default 20 */
  jwt: number
  /** @default 40 */
  refresh: number
}

export interface UsersControllerGetFindUsersParams {
  /** @default "hyomin@ojware.com" */
  email?: string | null
  /** @default "" */
  organizationId?: string | null
}

export interface UsersControllerDeleteRemoveMemberLicenseParams {
  /** @default "96d39061-a4d7-4de9-a147-f627467e11d5" */
  userId: string
  /** @default "Electrical" */
  type: 'Electrical' | 'Structural'
  /** @default "FLORIDA" */
  issuingCountryName: string
}

export interface OrganizationControllerFindMembersParams {
  /** @default "eaefe251-0f1f-49ac-88cb-3582ec76601d" */
  organizationId: string
}

export interface DepartmentControllerDeleteRevokePositionParams {
  /** @default "3696b9c7-916d-4812-871e-976c03a06d7e" */
  positionId: string
  /** @default "96d39061-a4d7-4de9-a147-f627467e11d5" */
  userId: string
}

export interface DepartmentControllerDeleteTerminateServiceMemberIsInChargeOfParams {
  /** @default "96d39061-a4d7-4de9-a147-f627467e11d5" */
  userId: string
  /** @default "a061c441-be8c-4bcc-9bcc-2460a01d5a16" */
  serviceId: string
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
  geoId?: string | null
}

export interface FindProjectsHttpControllerFindUsersParams {
  /** @default "Residential" */
  propertyType?: string | null
  /** @default null */
  projectNumber?: string | null
  /** @default "3480 Northwest 33rd Court" */
  propertyAddress?: string | null
  /** @default "" */
  clientId?: string | null
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
     * No description
     *
     * @name UsersControllerGetFindUsers
     * @request GET:/users
     */
    usersControllerGetFindUsers: (query: UsersControllerGetFindUsersParams, params: RequestParams = {}) =>
      this.request<UserResponseDto[], any>({
        path: `/users`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

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
     * @request POST:/users/gived-roles
     */
    usersControllerPostGiveRole: (data: GiveRoleRequestDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/users/gived-roles`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name UsersControllerDeleteRemoveRole
     * @request DELETE:/users/gived-roles/{userId}
     */
    usersControllerDeleteRemoveRole: (userId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/users/gived-roles/${userId}`,
        method: 'DELETE',
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
     * @name UsersControllerGetFindAllLicenses
     * @request GET:/users/member-licenses
     */
    usersControllerGetFindAllLicenses: (params: RequestParams = {}) =>
      this.request<LincenseResponseDto[], any>({
        path: `/users/member-licenses`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
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
     * @description // 추후 개선 사항 -> member-licenses/:licenseId
     *
     * @name UsersControllerDeleteRemoveMemberLicense
     * @request DELETE:/users/member-licenses
     */
    usersControllerDeleteRemoveMemberLicense: (
      query: UsersControllerDeleteRemoveMemberLicenseParams,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/users/member-licenses`,
        method: 'DELETE',
        query: query,
        ...params,
      }),
  }
  organizations = {
    /**
     * No description
     *
     * @name OrganizationControllerFindAll
     * @request GET:/organizations
     */
    organizationControllerFindAll: (params: RequestParams = {}) =>
      this.request<OrganizationResponseDto[], any>({
        path: `/organizations`,
        method: 'GET',
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
      this.request<void, any>({
        path: `/organizations`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name OrganizationControllerFindMembers
     * @request GET:/organizations/members
     */
    organizationControllerFindMembers: (query: OrganizationControllerFindMembersParams, params: RequestParams = {}) =>
      this.request<UserResponseDto[], any>({
        path: `/organizations/members`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name OrganizationControllerFindMyMembers
     * @request GET:/organizations/my/members
     */
    organizationControllerFindMyMembers: (params: RequestParams = {}) =>
      this.request<UserResponseDto[], any>({
        path: `/organizations/my/members`,
        method: 'GET',
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
     * @name DepartmentControllerPostAppointPosition
     * @request POST:/departments/member-positions
     */
    departmentControllerPostAppointPosition: (data: CreateMemberPositionRequestDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/departments/member-positions`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name DepartmentControllerDeleteRevokePosition
     * @request DELETE:/departments/member-positions
     */
    departmentControllerDeleteRevokePosition: (
      query: DepartmentControllerDeleteRevokePositionParams,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/departments/member-positions`,
        method: 'DELETE',
        query: query,
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

    /**
     * No description
     *
     * @name DepartmentControllerGetFindAllServices
     * @request GET:/departments/services
     */
    departmentControllerGetFindAllServices: (params: RequestParams = {}) =>
      this.request<ServiceResponseDto[], any>({
        path: `/departments/services`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name DepartmentControllerPostPutMemberInChageOfTheService
     * @request POST:/departments/member-services
     */
    departmentControllerPostPutMemberInChageOfTheService: (
      data: CreateMemberInChargeOfTheServiceRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/departments/member-services`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name DepartmentControllerDeleteTerminateServiceMemberIsInChargeOf
     * @request DELETE:/departments/member-services
     */
    departmentControllerDeleteTerminateServiceMemberIsInChargeOf: (
      query: DepartmentControllerDeleteTerminateServiceMemberIsInChargeOfParams,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/departments/member-services`,
        method: 'DELETE',
        query: query,
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
      this.request<void, any>({
        path: `/projects`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
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
      this.request<void, any>({
        path: `/jobs`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
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
      this.request<JobResponseDto, any>({
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
  }
  orderedTasks = {
    /**
     * No description
     *
     * @name CreateOrderedTaskHttpControllerCreate
     * @request POST:/ordered-tasks
     */
    createOrderedTaskHttpControllerCreate: (data: CreateOrderedTaskRequestDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/ordered-tasks`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),
  }
  orderdTasks = {
    /**
     * No description
     *
     * @name DeleteOrderedTaskHttpControllerDelete
     * @request DELETE:/orderd-tasks/{orderdTaskId}
     */
    deleteOrderedTaskHttpControllerDelete: (orderdTaskId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/orderd-tasks/${orderdTaskId}`,
        method: 'DELETE',
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
      this.request<void, any>({
        path: `/ordered-job-notes`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name FindJobNotesHttpControllerFind
     * @request GET:/ordered-job-notes
     */
    findJobNotesHttpControllerFind: (data: FindJobNotesRequestDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/ordered-job-notes`,
        method: 'GET',
        body: data,
        type: ContentType.Json,
        ...params,
      }),
  }
}
