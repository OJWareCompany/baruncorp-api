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
  /** @example "2023-07-26T08:08:22.825Z" */
  createdAt: string
  /** @example "2023-07-26T08:08:22.825Z" */
  updatedAt: string
  /** @example "2023-07-26T08:08:22.825Z" */
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

export type QueryParamsType = Record<string | number, any>
export type ResponseFormat = keyof Omit<Body, 'body' | 'bodyUsed'>

export interface FullRequestParams extends Omit<RequestInit, 'body'> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean
  /** request path */
  path: string
  /** content type of request body */
  type?: ContentType
  /** query params */
  query?: QueryParamsType
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat
  /** request body */
  body?: unknown
  /** base url */
  baseUrl?: string
  /** request cancellation token */
  cancelToken?: CancelToken
}

export type RequestParams = Omit<FullRequestParams, 'body' | 'method' | 'query' | 'path'>

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string
  baseApiParams?: Omit<RequestParams, 'baseUrl' | 'cancelToken' | 'signal'>
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void
  customFetch?: typeof fetch
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D
  error: E
}

type CancelToken = Symbol | string | number

export enum ContentType {
  Json = 'application/json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
  Text = 'text/plain',
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = ''
  private securityData: SecurityDataType | null = null
  private securityWorker?: ApiConfig<SecurityDataType>['securityWorker']
  private abortControllers = new Map<CancelToken, AbortController>()
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams)

  private baseApiParams: RequestParams = {
    credentials: 'same-origin',
    headers: {},
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  }

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig)
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data
  }

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key)
    return `${encodedKey}=${encodeURIComponent(typeof value === 'number' ? value : `${value}`)}`
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key])
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key]
    return value.map((v: any) => this.encodeQueryParam(key, v)).join('&')
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {}
    const keys = Object.keys(query).filter((key) => 'undefined' !== typeof query[key])
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join('&')
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery)
    return queryString ? `?${queryString}` : ''
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === 'object' || typeof input === 'string') ? JSON.stringify(input) : input,
    [ContentType.Text]: (input: any) => (input !== null && typeof input !== 'string' ? JSON.stringify(input) : input),
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key]
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === 'object' && property !== null
            ? JSON.stringify(property)
            : `${property}`,
        )
        return formData
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  }

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    }
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken)
      if (abortController) {
        return abortController.signal
      }
      return void 0
    }

    const abortController = new AbortController()
    this.abortControllers.set(cancelToken, abortController)
    return abortController.signal
  }

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken)

    if (abortController) {
      abortController.abort()
      this.abortControllers.delete(cancelToken)
    }
  }

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === 'boolean' ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {}
    const requestParams = this.mergeRequestParams(params, secureParams)
    const queryString = query && this.toQueryString(query)
    const payloadFormatter = this.contentFormatters[type || ContentType.Json]
    const responseFormat = format || requestParams.format

    return this.customFetch(`${baseUrl || this.baseUrl || ''}${path}${queryString ? `?${queryString}` : ''}`, {
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { 'Content-Type': type } : {}),
      },
      signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
      body: typeof body === 'undefined' || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response as HttpResponse<T, E>
      r.data = null as unknown as T
      r.error = null as unknown as E

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data
              } else {
                r.error = data
              }
              return r
            })
            .catch((e) => {
              r.error = e
              return r
            })

      if (cancelToken) {
        this.abortControllers.delete(cancelToken)
      }

      if (!response.ok) throw data
      return data
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
     * @request POST:/departments/user-positions
     */
    departmentControllerAppointPosition: (
      query: {
        userId: string
        positionId: string
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/departments/user-positions`,
        method: 'POST',
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @name DepartmentControllerRevokePosition
     * @request DELETE:/departments/user-positions
     */
    departmentControllerRevokePosition: (
      query: {
        userId: string
        positionId: string
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/departments/user-positions`,
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
