import { ApiProperty } from '@nestjs/swagger'
import { initialize } from '../../../libs/utils/constructor-initializer'
import { AutoOnlyJobStatusEnum, JobStatus, JobStatusEnum, LoadCalcOriginEnum } from '../domain/job.type'
import { AddressDto } from './address.dto'
import { AssignedTaskStatusEnum } from '../../assigned-task/domain/assigned-task.type'
import { IsDate, IsEnum, IsNumber, IsOptional, IsString, isNumber } from 'class-validator'
import {
  AutoOnlyOrderedServiceStatusEnum,
  OrderedScopeStatus,
  OrderedServicePricingTypeEnum,
  OrderedServiceSizeForRevisionEnum,
  OrderedServiceStatusEnum,
} from '../../ordered-service/domain/ordered-service.type'
import { MountingTypeEnum, ProjectPropertyTypeEnum } from '../../project/domain/project.type'
import { PrerequisiteTaskVO } from '../domain/value-objects/assigned-task.value-object'
import { PricingTypeEnum } from '../../invoice/dtos/invoice.response.dto'

export class OrderedServiceResponseFields {
  @ApiProperty()
  orderedServiceId: string

  @ApiProperty()
  serviceId: string

  @ApiProperty({ enum: OrderedServiceSizeForRevisionEnum, nullable: true })
  sizeForRevision: OrderedServiceSizeForRevisionEnum | null

  @ApiProperty()
  serviceName: string

  @ApiProperty()
  pricingType: OrderedServicePricingTypeEnum

  @ApiProperty()
  isRevision: boolean

  @ApiProperty()
  @IsOptional()
  description: string | null

  @ApiProperty()
  @IsOptional()
  price: number | null

  @ApiProperty()
  @IsOptional()
  priceOverride: number | null

  @ApiProperty({
    default: OrderedServiceStatusEnum.Completed,
    enum: [...Object.values(OrderedServiceStatusEnum), ...Object.values(AutoOnlyOrderedServiceStatusEnum)],
  })
  status: OrderedScopeStatus

  @ApiProperty()
  orderedAt: string

  @ApiProperty()
  @IsOptional()
  doneAt: string | null

  constructor(props: OrderedServiceResponseFields) {
    initialize(this, props)
  }
}

export class AssignedTaskResponseFields {
  @ApiProperty()
  assignTaskId: string

  @ApiProperty({ example: AssignedTaskStatusEnum.Not_Started, enum: AssignedTaskStatusEnum })
  status: string

  @ApiProperty()
  taskName: string

  @ApiProperty()
  taskId: string

  @ApiProperty()
  orderedServiceId: string

  @ApiProperty()
  @IsOptional()
  startedAt: string | null

  @ApiProperty()
  assigneeName: string | null

  @ApiProperty()
  @IsOptional()
  assigneeId: string | null

  @ApiProperty()
  @IsOptional()
  doneAt: string | null

  @ApiProperty()
  @IsOptional()
  description: string | null

  @ApiProperty()
  @IsOptional()
  duration: number | null

  @ApiProperty()
  prerequisiteTasks: PrerequisiteTaskVO[]

  constructor(props: AssignedTaskResponseFields) {
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

  @ApiProperty({ example: 'gyals0386@gmail.com' })
  contactEmail: string

  @ApiProperty({ example: 'gyals0386@gmail.com', type: String, isArray: true })
  deliverablesEmails: string[]
}

export class JobResponseDto {
  @ApiProperty({ example: '5c29f1ae-d50b-4400-a6fb-b1a2c87126e9' })
  id: string

  @ApiProperty({ example: '5c29f1ae-d50b-4400-a6fb-b1a2c87126e9' })
  projectId: string

  @ApiProperty()
  isContainsRevisionTask: boolean

  @ApiProperty({ enum: ProjectPropertyTypeEnum })
  projectPropertyType: ProjectPropertyTypeEnum

  @ApiProperty()
  billingCodes: string[]

  @ApiProperty({ enum: OrderedServiceSizeForRevisionEnum, nullable: true })
  @IsOptional()
  revisionSize: OrderedServiceSizeForRevisionEnum | null

  @ApiProperty({ enum: OrderedServiceSizeForRevisionEnum, nullable: true })
  @IsOptional()
  eeChangeScope: OrderedServiceSizeForRevisionEnum | null

  @ApiProperty({ enum: OrderedServiceSizeForRevisionEnum, nullable: true })
  @IsOptional()
  structuralRevisionScope: OrderedServiceSizeForRevisionEnum | null

  @ApiProperty({ enum: OrderedServiceSizeForRevisionEnum, nullable: true })
  @IsOptional()
  designRevisionScope: OrderedServiceSizeForRevisionEnum | null

  @ApiProperty({ example: 300.1 })
  systemSize: number | null

  @ApiProperty({ example: AddressDto })
  mailingAddressForWetStamp: AddressDto | null

  @ApiProperty({ example: MountingTypeEnum.Ground_Mount, enum: MountingTypeEnum })
  mountingType: MountingTypeEnum

  @ApiProperty({ example: 3 })
  numberOfWetStamp: number | null

  @ApiProperty({ example: 'Please check this out.' })
  additionalInformationFromClient: string | null

  @ApiProperty({ example: 'Chris Kim' })
  updatedBy: string

  @ApiProperty({ example: '176 Morningmist Road, Naugatuck, Connecticut 06770' })
  propertyFullAddress: string

  @ApiProperty({ example: 5 })
  jobRequestNumber: number

  @ApiProperty({
    example: JobStatusEnum.In_Progress,
    enum: [...Object.values(JobStatusEnum), ...Object.values(AutoOnlyJobStatusEnum)],
  })
  jobStatus: JobStatus

  @ApiProperty({ example: LoadCalcOriginEnum.Self, enum: LoadCalcOriginEnum })
  loadCalcOrigin: LoadCalcOriginEnum

  @ApiProperty({ example: AssignedTaskResponseFields, type: AssignedTaskResponseFields, isArray: true })
  assignedTasks: AssignedTaskResponseFields[]

  @ApiProperty({ example: OrderedServiceResponseFields, type: OrderedServiceResponseFields, isArray: true })
  orderedServices: OrderedServiceResponseFields[]

  @ApiProperty({ example: ClientInformationFields, type: ClientInformationFields })
  clientInfo: ClientInformationFields

  @ApiProperty({ example: '2023-08-11 09:10:31' })
  receivedAt: string

  @ApiProperty({ example: true })
  isExpedited: boolean

  @ApiProperty()
  jobName: string

  @ApiProperty()
  isCurrentJob?: boolean

  @ApiProperty()
  @IsDate()
  @IsOptional()
  dateSentToClient: Date | null

  @ApiProperty()
  @IsNumber()
  price: number

  @ApiProperty()
  @IsNumber()
  taskSubtotal: number

  @ApiProperty()
  @IsEnum(PricingTypeEnum)
  pricingType: PricingTypeEnum

  @ApiProperty()
  @IsString()
  state: string

  @ApiProperty()
  @IsDate()
  @IsOptional()
  dueDate: Date | null

  constructor(props: JobResponseDto) {
    initialize(this, props)
  }
}
// pricingType
// state
// taskSubtotal
