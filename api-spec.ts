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

export interface LoginReq {
  email: string
  password: string
}

export interface TokenResponse {
  accessToken: string
  refreshToken: string
}

export interface SignUpReq {
  firstName: string
  lastName: string
  email: string
  password: string
  code: string
}

export interface PositionResponseDto {
  id: string
  name: string
  description: string
  department: string
}

export type ServiceResponseDto = object

export interface LincenseResponseDto {
  userName: string
  type: object
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

export interface UpdateUserReq {
  firstName: string
  lastName: string
}

export interface GiveRoleRequestDto {
  userId: string
  lol: string
}

export interface CreateInvitationMailReq {
  organizationName: string
  email: string
}

export type OrganizationResponseDto = object

export interface CreateOrganizationReq {
  email: string
  street1: string
  street2: string
  city: string
  stateOrRegion: string
  postalCode: string
  country: string
  phoneNumber: string
  name: string
  description: string
  /** @pattern /(client|individual|outsourcing)/ */
  organizationType: string
}

export interface CreateLicenseRequestDto {
  userId: string
  type: object
  issuingCountryName: string
  abbreviation: string
  priority: number
  /** @format date-time */
  issuedDate: string
  /** @format date-time */
  expiryDate: string
}

export interface PutMemberInChargeOfTheService {
  userId: string
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
  /** @example "https://google.com" */
  website: string
  /** @example "See Notes" */
  specificFormRequired: 'No' | 'Yes' | 'See Notes'
  /** @example "generalNotes..." */
  generalNotes: string
  /** @example "2015 IBC2" */
  buildingCodes: string
  /** @example "Arcata city" */
  name: string
  /** @example "Arroyo Grande city, California" */
  fullAhjName: string
  /** @example "2023-07-27T01:57:21.796Z" */
  createdAt: string
  /** @example "2023-07-27T01:57:21.796Z" */
  updatedAt: string
  /** @example "2023-07-27T01:57:21.796Z" */
  updatedBy: string
  /** @example "COUNTY" */
  type: 'STATE' | 'COUNTY' | 'COUNTY SUBDIVISIONS' | 'PLACE'
}

export interface Design {
  /** @example "fireSetBack..." */
  fireSetBack: string
  /** @example "utilityNotes..." */
  utilityNotes: string
  /** @example "designNotes..." */
  designNotes: string
  /** @example "See Notes" */
  pvMeterRequired: 'No' | 'Yes' | 'See Notes'
  /** @example "See Notes" */
  acDisconnectRequired: 'No' | 'Yes' | 'See Notes'
  /** @example "See Notes" */
  centerFed120Percent: 'No' | 'Yes' | 'See Notes'
  /** @example "deratedAmpacity..." */
  deratedAmpacity: string
}

export interface Engineering {
  /** @example "See Notes" */
  iebcAccepted: 'No' | 'Yes' | 'See Notes'
  /** @example "See Notes" */
  structuralObservationRequired: 'No' | 'Yes' | 'See Notes'
  /** @example "Certified" */
  digitalSignatureType: 'Certified' | 'Signed'
  /** @example "See Notes" */
  windUpliftCalculationRequired: 'No' | 'Yes' | 'See Notes'
  /** @example "115" */
  windSpeed: string
  /** @example "See Notes" */
  windExposure: 'B' | 'C' | 'D' | 'See Notes'
  /** @example "30" */
  snowLoadGround: string
  /** @example "30" */
  snowLoadFlatRoof: string
  /** @example "30" */
  snowLoadSlopedRoof: string
  /** @example "See Notes" */
  wetStampsRequired: 'No' | 'Yes' | 'See Notes'
  /** @example "ofWetStamps..." */
  ofWetStamps: string
  /** @example "ANSI B (11x17 INCH)" */
  wetStampSize:
    | 'ANSI A (8.5x11 INCH)'
    | 'ANSI B (11x17 INCH)'
    | 'ANSI D (22x34 INCH)'
    | 'ARCH D (24x36 INCH)'
    | 'See Notes'
  /** @example "engineeringNotes..." */
  engineeringNotes: string
}

export interface ElectricalEngineering {
  /** @example "electricalNotes..." */
  electricalNotes: string
}

export interface AhjNoteResponseDto {
  general: General
  design: Design
  engineering: Engineering
  electricalEngineering: ElectricalEngineering
}

export interface UpdateGeneral {
  /** @example "https://google.com" */
  website: string
  /** @example "See Notes" */
  specificFormRequired: 'No' | 'Yes' | 'See Notes'
  /** @example "generalNotes..." */
  generalNotes: string
  /** @example "buildingCodes..." */
  buildingCodes: string
}

export interface UpdateNoteRequestDto {
  general: UpdateGeneral
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
  street1: string
  street2: string
  city: string
  state: string
  postalCode: string
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
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || '' })
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
 * @contact
 *
 * The cats API description
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  auth = {
    /**
     * No description
     *
     * @name AuthenticationControllerSignIn
     * @request POST:/auth/signin
     */
    authenticationControllerSignIn: (data: LoginReq, params: RequestParams = {}) =>
      this.request<TokenResponse, any>({
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
     * @name AuthenticationControllerSignInTime
     * @request POST:/auth/signin-time
     */
    authenticationControllerSignInTime: (
      query: {
        jwt: number
        refresh: number
      },
      data: LoginReq,
      params: RequestParams = {},
    ) =>
      this.request<TokenResponse, any>({
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
     * @name AuthenticationControllerSignout
     * @request POST:/auth/signout
     */
    authenticationControllerSignout: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/auth/signout`,
        method: 'POST',
        ...params,
      }),

    /**
     * No description
     *
     * @name AuthenticationControllerSignUp
     * @request POST:/auth/signup
     */
    authenticationControllerSignUp: (data: SignUpReq, params: RequestParams = {}) =>
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
     * @name AuthenticationControllerMe
     * @request GET:/auth/me
     */
    authenticationControllerMe: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/auth/me`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @name AuthenticationControllerRefresh
     * @request GET:/auth/refresh
     */
    authenticationControllerRefresh: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/auth/refresh`,
        method: 'GET',
        ...params,
      }),
  }
  users = {
    /**
     * No description
     *
     * @name UsersControllerFindUsers
     * @request GET:/users
     */
    usersControllerFindUsers: (
      query: {
        email: string
      },
      params: RequestParams = {},
    ) =>
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
     * @name UsersControllerUpdateUserByUserId
     * @request PATCH:/users/profile/{userId}
     */
    usersControllerUpdateUserByUserId: (userId: string, data: UpdateUserReq, params: RequestParams = {}) =>
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
     * @name UsersControllerUpdateUser
     * @request PATCH:/users/profile
     */
    usersControllerUpdateUser: (data: UpdateUserReq, params: RequestParams = {}) =>
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
     * @name UsersControllerGiveRole
     * @request POST:/users/gived-roles
     */
    usersControllerGiveRole: (data: GiveRoleRequestDto, params: RequestParams = {}) =>
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
     * @name UsersControllerRemoveRole
     * @request DELETE:/users/gived-roles/{userId}
     */
    usersControllerRemoveRole: (userId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/users/gived-roles/${userId}`,
        method: 'DELETE',
        ...params,
      }),

    /**
     * No description
     *
     * @name UsersControllerSendInvitationMail
     * @request POST:/users/invitations
     */
    usersControllerSendInvitationMail: (data: CreateInvitationMailReq, params: RequestParams = {}) =>
      this.request<ServiceResponseDto, any>({
        path: `/users/invitations`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
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
     * @name OrganizationControllerCreateOrganization
     * @request POST:/organizations
     */
    organizationControllerCreateOrganization: (data: CreateOrganizationReq, params: RequestParams = {}) =>
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
    organizationControllerFindMembers: (
      query: {
        organizationId: string
      },
      params: RequestParams = {},
    ) =>
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
     * @name DepartmentControllerFindAllPositions
     * @request GET:/departments/positions
     */
    departmentControllerFindAllPositions: (params: RequestParams = {}) =>
      this.request<PositionResponseDto[], any>({
        path: `/departments/positions`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name DepartmentControllerAppointPosition
     * @request POST:/departments/member-positions
     */
    departmentControllerAppointPosition: (
      query: {
        userId: string
        positionId: string
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/departments/member-positions`,
        method: 'POST',
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @name DepartmentControllerRevokePosition
     * @request DELETE:/departments/member-positions
     */
    departmentControllerRevokePosition: (
      query: {
        userId: string
        positionId: string
      },
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
     * @name DepartmentControllerFindAllStates
     * @request GET:/departments/states
     */
    departmentControllerFindAllStates: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/departments/states`,
        method: 'GET',
        ...params,
      }),

    /**
     * @description 등록된 모든 라이센스 조회 라이센스: 특정 State에서 작업 허가 받은 Member의 자격증
     *
     * @name DepartmentControllerFindAllLicenses
     * @request GET:/departments/member-licenses
     */
    departmentControllerFindAllLicenses: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/departments/member-licenses`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @name DepartmentControllerPostLicense
     * @request POST:/departments/member-licenses
     */
    departmentControllerPostLicense: (data: CreateLicenseRequestDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/departments/member-licenses`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name DepartmentControllerDeleteLicense
     * @request DELETE:/departments/member-licenses
     */
    departmentControllerDeleteLicense: (
      query: {
        userId: string
        type: string
        issuingCountryName: string
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/departments/member-licenses`,
        method: 'DELETE',
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @name DepartmentControllerFindAllServices
     * @request GET:/departments/services
     */
    departmentControllerFindAllServices: (params: RequestParams = {}) =>
      this.request<ServiceResponseDto[], any>({
        path: `/departments/services`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name DepartmentControllerPutMemberInChageOfTheService
     * @request POST:/departments/member-services
     */
    departmentControllerPutMemberInChageOfTheService: (
      data: PutMemberInChargeOfTheService,
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
     * @name DepartmentControllerTerminateServiceMemberIsInChargeOf
     * @request DELETE:/departments/member-services
     */
    departmentControllerTerminateServiceMemberIsInChargeOf: (
      query: {
        userId: string
        serviceId: string
      },
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
     * @name GeographyControllerFindNotes
     * @request GET:/geography/notes
     * @secure
     */
    geographyControllerFindNotes: (
      query?: {
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
        geoId?: string
        fullAhjName?: string
        name?: string
      },
      params: RequestParams = {},
    ) =>
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
     * @name GeographyControllerFindNoteByGeoId
     * @request GET:/geography/{geoId}/notes
     * @secure
     */
    geographyControllerFindNoteByGeoId: (geoId: string, params: RequestParams = {}) =>
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
     * @name GeographyControllerUpdateNote
     * @request PUT:/geography/{geoId}/notes
     * @secure
     */
    geographyControllerUpdateNote: (geoId: string, data: UpdateNoteRequestDto, params: RequestParams = {}) =>
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
     * @name GeographyControllerFindNoteUpdateHistoryDetail
     * @request GET:/geography/notes/history/{historyId}
     * @secure
     */
    geographyControllerFindNoteUpdateHistoryDetail: (historyId: number, params: RequestParams = {}) =>
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
     * @name GeographyControllerFindNoteUpdateHistory
     * @request GET:/geography/notes/history
     * @secure
     */
    geographyControllerFindNoteUpdateHistory: (
      query?: {
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
        geoId?: string
      },
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
     * @name ProjectControllerCreateProject
     * @request POST:/projects
     */
    projectControllerCreateProject: (data: AddressFromMapBox, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/projects`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),
  }
}
