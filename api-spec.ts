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
  /** @default "thisistestPass123!" */
  password: string
  /** @default "AE2DE" */
  code: string
  /** @default "176 Morningmist Road, Naugatuck, Connecticut 06770" */
  address: string
  /** @default "857-250-4567" */
  phoneNumber: string
  /** @default true */
  isActiveWorkResource: boolean
  /** @default true */
  isCurrentUser: boolean
  /** @default true */
  isInactiveOrganizationUser: boolean
  /** @default true */
  revenueShare: boolean
  /** @default true */
  revisionRevenueShare: boolean
  /** @default "CLIENT" */
  type: string
}

export interface AccessTokenResponseDto {
  accessToken: string
}

export interface PositionResponseDto {
  id: string
  name: string
  description: string
  department: string
}

export interface ServiceResponseDto {
  /** @default "9e773832-ad39-401d-b1c2-16d74f9268ea" */
  id: string
  /** @default "Structural Calculation" */
  name: string
  /** @default "Structural Calculation is service..." */
  description: string
}

export interface LincenseResponseDto {
  userName: string
  type: 'Electrical' | 'Structural'
  issuingCountryName: string
  abbreviation: string
  priority: number
  /** @format date-time */
  issuedDate: string
  /** @format date-time */
  expiryDate: string
}

export interface UserResponseDto {
  id: string
  email: string
  firstName: string
  lastName: string
  fullName: string
  organization: string
  position: PositionResponseDto
  services: ServiceResponseDto[]
  licenses: LincenseResponseDto[]
  role: string
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
  /**
   * @format date-time
   * @default "2023-08-16T01:28:30.619Z"
   */
  issuedDate: string
  /**
   * @format date-time
   * @default "2023-08-16T01:28:30.619Z"
   */
  expiryDate: string
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
  stateOrRegion: string
  street1: string
  street2: string
  isActiveContractor: number | null
  isActiveWorkResource: number | null
  revenueShare: number | null
  revisionRevenueShare: number | null
  invoiceRecipient: string | null
  invoiceRecipientEmail: string | null
}

export interface CreateOrganizationRequestDto {
  /** @default "hyomin@ojware.com" */
  email: string
  /** @default "Apple Valley Airport" */
  street1: string
  /** @default "A 101" */
  street2: string
  /** @default "Apple Valley" */
  city: string
  /** @default "California" */
  stateOrRegion: string
  /** @default "92307" */
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
  /** @default "chris kim" */
  isActiveContractor: number | null
  /** @default "chris kim" */
  isActiveWorkResource: number | null
  /** @default "chris kim" */
  revenueShare: number | null
  /** @default "chris kim" */
  revisionRevenueShare: number | null
  /** @default "chris kim" */
  invoiceRecipient: string | null
  /** @default "chriskim@gmail.com" */
  invoiceRecipientEmail: string | null
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
  abbreviation: string
  /** @default "06" */
  geoId: string
  /** @default "06" */
  stateCode: string
  /** @default "01779778" */
  ansiCode: string
  /** @default "California" */
  stateLongName: string
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
  /** @default "2023-08-16T01:28:30.652Z" */
  createdAt: string | null
  /** @default "2023-08-16T01:28:30.652Z" */
  updatedAt: string | null
  /** @default "2023-08-16T01:28:30.652Z" */
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
  /** @default "3480 Northwest 33rd Court" */
  street1: string
  /** @default "" */
  street2: string
  /** @default "Lauderdale Lakes" */
  city: string
  /** @default "Florida" */
  state: string
  /** @default "33309" */
  postalCode: string
}

export interface AuthenticationControllerPostSignInTimeParams {
  /** @default 20 */
  jwt: number
  /** @default 40 */
  refresh: number
}

export interface UsersControllerGetFindUsersParams {
  /** @default "hyomin@ojware.com" */
  email?: string
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
   */
  limit?: number
  /**
   * Page number
   * @default 1
   */
  page?: number
  /** @default "1239525" */
  geoId?: string
  /** @default "city" */
  fullAhjName?: string
  /** @default "city" */
  name?: string
}

export interface GeographyControllerGetFindNoteUpdateHistoryParams {
  /**
   * Specifies a limit of returned records
   * @default 20
   */
  limit?: number
  /**
   * Page number
   * @default 1
   */
  page?: number
  /** @default "1239525" */
  geoId?: string
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
  projects = {
    /**
     * @description Census에서 행정구역이 매칭되지 않는 주소들이 있음 Census 결과와 상관 없이 프로젝트는 생성되어야함
     *
     * @name ProjectControllerPostCreateProject
     * @request POST:/projects
     */
    projectControllerPostCreateProject: (data: AddressFromMapBox, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/projects`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),
  }
}
