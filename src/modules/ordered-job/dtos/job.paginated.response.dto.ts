import { ApiProperty } from '@nestjs/swagger'
import { PaginatedResponseDto } from '../../../libs/api/page.response.dto'
import { initialize } from '../../../libs/utils/constructor-initializer'
import { JobStatus, JobStatusEnum } from '../domain/job.type'

export class MemberResponseFields {
  @ApiProperty({ example: '5c29f1ae-d50b-4400-a6fb-b1a2c87126e9' })
  userId: string | null

  @ApiProperty({ example: 'Chris Kim' })
  name: string | null
}

export class OrderedTaskPaginatedResponseFields {
  @ApiProperty({ example: '5c29f1ae-d50b-4400-a6fb-b1a2c87126e9' })
  id: string

  @ApiProperty({ example: 'Not Started' })
  taskStatus: string

  @ApiProperty({ example: 'PV Design' })
  taskName: string

  @ApiProperty({ example: MemberResponseFields, type: MemberResponseFields })
  assignee: MemberResponseFields

  @ApiProperty({ example: null })
  description: string | null

  @ApiProperty({ example: '2023-08-11 09:10:31' })
  createdAt: string

  constructor(props: OrderedTaskPaginatedResponseFields) {
    initialize(this, props)
  }
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

  @ApiProperty({ example: OrderedTaskPaginatedResponseFields, type: OrderedTaskPaginatedResponseFields, isArray: true })
  orderedTasks: OrderedTaskPaginatedResponseFields[]

  @ApiProperty({ example: ClientInformationFields, type: ClientInformationFields })
  clientInfo: ClientInformationFields

  @ApiProperty({ example: '2023-08-11 09:10:31' })
  receivedAt: string
}

export class JobPaginatedResponseDto extends PaginatedResponseDto<JobPaginatedResponseFields> {
  @ApiProperty({ type: JobPaginatedResponseFields, isArray: true })
  items: readonly JobPaginatedResponseFields[]
}
