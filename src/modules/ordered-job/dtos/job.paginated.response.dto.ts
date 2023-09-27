import { ApiProperty } from '@nestjs/swagger'
import { PaginatedResponseDto } from '../../../libs/api/page.response.dto'
import { JobStatus, JobStatusEnum } from '../domain/job.type'
import { OrderedServiceResponseFields, AssignedTaskResponseFields } from './job.response.dto'

export class MemberResponseFields {
  @ApiProperty({ example: '5c29f1ae-d50b-4400-a6fb-b1a2c87126e9' })
  userId: string | null

  @ApiProperty({ example: 'Chris Kim' })
  name: string | null
}

export class ClientInformationFields {
  @ApiProperty({ example: '5c29f1ae-d50b-4400-a6fb-b1a2c87126e9' })
  clientOrganizationId: string

  @ApiProperty({ example: 'Barun Corp' })
  clientOrganizationName: string

  @ApiProperty({ example: '5c29f1ae-d50b-4400-a6fb-b1a2c87126e9' })
  clientUserId: string

  @ApiProperty({ example: 'Chris Kim' })
  clientUserName: string
}

export class JobPaginatedResponseFields {
  @ApiProperty({ example: '5c29f1ae-d50b-4400-a6fb-b1a2c87126e9' })
  id: string

  @ApiProperty({ example: '176 Morningmist Road, Naugatuck, Connecticut 06770' })
  propertyFullAddress: string

  @ApiProperty({ example: 5 })
  jobRequestNumber: number

  @ApiProperty({ example: JobStatusEnum.In_Progress, enum: JobStatusEnum })
  jobStatus: JobStatus

  @ApiProperty({ example: 'Residential' })
  projectType: string

  @ApiProperty({ example: 'Ground Mount' })
  mountingType: string

  @ApiProperty({ example: OrderedServiceResponseFields, type: OrderedServiceResponseFields, isArray: true })
  orderedServices: OrderedServiceResponseFields[]

  @ApiProperty({ example: AssignedTaskResponseFields, type: AssignedTaskResponseFields, isArray: true })
  assignedTasks: AssignedTaskResponseFields[]

  @ApiProperty({ example: ClientInformationFields, type: ClientInformationFields })
  clientInfo: ClientInformationFields

  @ApiProperty({ example: '2023-08-11 09:10:31' })
  receivedAt: string

  @ApiProperty({ example: true })
  isExpedited: boolean

  @ApiProperty({ example: 'Please check this out.' })
  additionalInformationFromClient: string | null
}

export class JobPaginatedResponseDto extends PaginatedResponseDto<JobPaginatedResponseFields> {
  @ApiProperty({ type: JobPaginatedResponseFields, isArray: true })
  items: readonly JobPaginatedResponseFields[]
}
