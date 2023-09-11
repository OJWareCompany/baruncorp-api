import { ApiProperty } from '@nestjs/swagger'
import { JobStatus, JobStatusEnum } from '../domain/job.type'
import { Address } from '../../organization/domain/value-objects/address.vo'

export class MemberResponseFields {
  @ApiProperty({ example: '5c29f1ae-d50b-4400-a6fb-b1a2c87126e9' })
  userId: string | null

  @ApiProperty({ example: 'Chris Kim' })
  name: string | null

  constructor(props: MemberResponseFields) {
    this.userId = props.userId
    this.name = props.name
  }
}

export class OrderedTaskResponseFields {
  @ApiProperty({ example: '5c29f1ae-d50b-4400-a6fb-b1a2c87126e9' })
  id: string

  @ApiProperty({ example: 'Not Started' })
  taskStatus: string

  @ApiProperty({ example: 'PV Design' })
  taskName: string

  @ApiProperty({ example: MemberResponseFields, type: MemberResponseFields })
  assigneeName: MemberResponseFields

  @ApiProperty({ example: null })
  description: string | null

  constructor(props: OrderedTaskResponseFields) {
    this.id = props.id
    this.taskStatus = props.taskStatus
    this.taskName = props.taskName
    this.assigneeName = props.assigneeName
    this.description = props.description
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

  @ApiProperty({ example: 'gyals0386@gmail.com' })
  contactEmail: string

  @ApiProperty({ example: 'gyals0386@gmail.com', type: String, isArray: true })
  deliverablesEmails: string[]
}

export class JobResponseDto {
  @ApiProperty({ example: '5c29f1ae-d50b-4400-a6fb-b1a2c87126e9' })
  projectId: string

  @ApiProperty({ example: 300.1 })
  systemSize: number | null

  @ApiProperty({ example: Address })
  mailingAddressForWetStamp: Address | null

  @ApiProperty({ example: 'Ground Mount' })
  mountingType: string

  @ApiProperty({ example: 3 })
  numberOfWetStamp: number | null

  @ApiProperty({ example: 'Please check this out.' })
  additionalInformationFromClient: string | null

  @ApiProperty({ example: 'Chris Kim' })
  updatedBy: string

  @ApiProperty({ example: '176 Morningmist Road, Naugatuck, Connecticut 06770' })
  propertyFullAddress: string

  @ApiProperty({ example: 5 })
  jobRequestNumber: number | null

  @ApiProperty({ example: JobStatusEnum.In_Progress, enum: JobStatusEnum })
  jobStatus: JobStatus

  @ApiProperty({ example: 'Residential' })
  projectType: string

  @ApiProperty({ example: OrderedTaskResponseFields, type: OrderedTaskResponseFields, isArray: true })
  orderedTasks: OrderedTaskResponseFields[]

  @ApiProperty({ example: ClientInformationFields, type: ClientInformationFields })
  clientInfo: ClientInformationFields

  @ApiProperty({ example: '2023-08-11 09:10:31' })
  receivedAt: string

  @ApiProperty({ example: true })
  isExpedited: boolean
}
