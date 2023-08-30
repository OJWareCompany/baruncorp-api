import { PaginatedResponseDto } from '../../../libs/ddd/page.response.dto'
import { ApiProperty } from '@nestjs/swagger'

class MemberResponseFields {
  @ApiProperty({ example: '5c29f1ae-d50b-4400-a6fb-b1a2c87126e9' })
  userId: string

  @ApiProperty({ example: 'Chris Kim' })
  name: string
}

class OrderedTaskResponseFields {
  @ApiProperty({ example: '5c29f1ae-d50b-4400-a6fb-b1a2c87126e9' })
  id: string

  @ApiProperty({ example: 'Not Started' })
  taskStatus: string

  @ApiProperty({ example: 'PV Design' })
  taskName: string

  @ApiProperty({ example: MemberResponseFields, type: MemberResponseFields })
  assignedTo: MemberResponseFields | null

  @ApiProperty({ example: null })
  description: string | null
}

class ClientInformationFields {
  @ApiProperty({ example: '5c29f1ae-d50b-4400-a6fb-b1a2c87126e9' })
  clientOrganizationId: string

  @ApiProperty({ example: 'Barun Corp' })
  clientOrganizationName: string
}

export class JobPaginatedResponseFields {
  @ApiProperty({ example: '176 Morningmist Road, Naugatuck, Connecticut 06770' })
  propertyAddress: string

  @ApiProperty({ example: '10223' })
  jobNumber: string | null

  @ApiProperty({ example: 5 })
  jobRequestNumber: number

  @ApiProperty({ example: 'In Progess' })
  jobStatus: string

  @ApiProperty({ example: 'Residential' })
  projectType: string

  @ApiProperty({ example: 'Ground Mount' })
  mountingType: string

  @ApiProperty({ example: OrderedTaskResponseFields, type: OrderedTaskResponseFields, isArray: true })
  orderedTasks: OrderedTaskResponseFields[]

  @ApiProperty({ example: ClientInformationFields, type: ClientInformationFields })
  clientInfo: ClientInformationFields

  @ApiProperty({ example: '2023-08-11 09:10:31' })
  receivedAt: string
}

export class JobPaginatedResponseDto extends PaginatedResponseDto<JobPaginatedResponseFields> {
  @ApiProperty({ type: JobPaginatedResponseFields, isArray: true })
  items: readonly JobPaginatedResponseFields[]
}
