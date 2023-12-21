import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'

export class VendorInvoiceLineItemResponse {
  @ApiProperty()
  @IsString()
  vendorInvoiceId: string

  @ApiProperty()
  @IsString()
  taskId: string

  @ApiProperty()
  @IsString()
  assgineeId: string

  @ApiProperty()
  @IsString()
  assgineeName: string

  @ApiProperty()
  @IsString()
  clientOrganizationId: string

  @ApiProperty()
  @IsString()
  clientOrganizationName: string

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
