import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'
import {
  OrderedJobsPriorityEnum,
  OrderedJobsPriorityLevelEnum,
} from '../../ordered-job/domain/value-objects/priority.value-object'

export class VendorInvoiceLineItemResponse {
  @ApiProperty()
  @IsString()
  vendorInvoiceId: string

  @ApiProperty()
  @IsString()
  taskId: string

  @ApiProperty()
  @IsString()
  assigneeId: string

  @ApiProperty()
  @IsString()
  assigneeName: string

  @ApiProperty()
  @IsString()
  assigneeOrganizationId: string

  @ApiProperty()
  @IsString()
  assigneeOrganizationName: string

  @ApiProperty()
  @IsString()
  clientOrganizationId: string

  @ApiProperty()
  @IsString()
  clientOrganizationName: string

  @ApiProperty()
  @IsString()
  taskName: string

  @ApiProperty()
  @IsString()
  jobId: string

  @ApiProperty()
  @IsString()
  projectId: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  projectNumber: string | null

  @ApiProperty()
  @IsString()
  @IsOptional()
  jobDescription: string | null

  @ApiProperty()
  @IsString()
  @IsOptional()
  propertyOwnerName: string | null

  @ApiProperty()
  @IsString()
  serviceName: string

  @ApiProperty()
  @IsString()
  serviceId: string

  @ApiProperty()
  @IsString()
  orderedServiceId: string

  @ApiProperty({ example: OrderedJobsPriorityEnum.High, enum: OrderedJobsPriorityEnum })
  @IsEnum(OrderedJobsPriorityEnum)
  priority: OrderedJobsPriorityEnum

  @ApiProperty({ example: OrderedJobsPriorityLevelEnum.High, enum: OrderedJobsPriorityLevelEnum })
  @IsEnum(OrderedJobsPriorityLevelEnum)
  priorityLevel: OrderedJobsPriorityLevelEnum

  @ApiProperty()
  @IsString()
  @IsOptional()
  serviceDescription: string | null

  @ApiProperty()
  @IsNumber()
  taskExpenseTotal: number

  @ApiProperty()
  @IsBoolean()
  isRevision: boolean

  @ApiProperty()
  @IsString()
  createdAt: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  doneAt: string | null
}

// invoiceId: string
// taskId: string
// assginee: string
// clientOrganizationName: string
// projectNumber: string | null
// jobNumber: string | null
// jobDescription: string | null
// propertyOwnerName: string
// serviceName: string
// serviceDescription: string
// taskExpenseTotal: number
// isRevision: boolean
// createdAt: boolean
// doneAt: string | null
// note: string | null
