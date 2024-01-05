import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'
import { initialize } from '../../../libs/utils/constructor-initializer'
import { AssignedTaskStatusEnum } from '../domain/assigned-task.type'

export class AssignedTaskResponseDto {
  @ApiProperty()
  @IsString()
  readonly id: string

  @ApiProperty()
  @IsString()
  readonly taskId: string

  @ApiProperty()
  @IsString()
  readonly taskName: string

  @ApiProperty()
  @IsString()
  readonly orderedServiceId: string

  @ApiProperty()
  @IsString()
  readonly serviceName: string

  @ApiProperty()
  @IsString()
  readonly jobId: string

  // @ApiProperty({ example: 5 })
  // @IsString()
  // readonly jobRequestNumber: number

  @ApiProperty({ default: AssignedTaskStatusEnum.Not_Started, enum: AssignedTaskStatusEnum })
  @IsString()
  readonly status: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly description: string | null

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly assigneeId: string | null

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly assigneeName: string | null

  @ApiProperty()
  @IsString()
  readonly projectId: string

  @ApiProperty()
  @IsString()
  readonly organizationId: string

  @ApiProperty()
  @IsString()
  readonly organizationName: string

  @ApiProperty()
  @IsString()
  readonly projectPropertyType: string

  @ApiProperty()
  @IsString()
  readonly mountingType: string

  @ApiProperty()
  @IsString()
  readonly serviceId: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly vendorInvoiceId: string | null

  @ApiProperty()
  @IsBoolean()
  readonly isVendor: boolean

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly startedAt: Date | null

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly doneAt: Date | null

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly createdAt: Date | null

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  readonly duration: number | null

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  readonly cost: number | null

  constructor(props: AssignedTaskResponseDto) {
    initialize(this, props)
  }
}
