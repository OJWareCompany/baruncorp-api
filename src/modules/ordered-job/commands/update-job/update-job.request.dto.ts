import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsString, IsNumber, IsOptional, IsObject } from 'class-validator'
import { JobStatus, JobStatusEnum } from '../../domain/job.type'
import { Address } from '../../../organization/domain/value-objects/address.vo'

export class UpdateJobRequestDto {
  @ApiProperty({ default: 'chris@barun.com' })
  @IsArray()
  deliverablesEmails: string[]

  @ApiProperty({ default: JobStatusEnum.In_Progress, enum: JobStatusEnum })
  @IsString()
  jobStatus: JobStatus

  @ApiProperty({ default: '07ec8e89-6877-4fa1-a029-c58360b57f43' })
  @IsString()
  clientUserId: string

  @ApiProperty({ default: 'please, check this out.' })
  @IsString()
  @IsOptional()
  additionalInformationFromClient: string | null

  @ApiProperty({ default: 300.1 })
  @IsNumber()
  @IsOptional()
  systemSize: number | null

  @ApiProperty({ default: Address })
  @IsObject()
  @IsOptional()
  mailingAddressForWetStamp: Address | null

  @ApiProperty({ default: 3 })
  @IsNumber()
  @IsOptional()
  numberOfWetStamp: number | null

  @ApiProperty({ default: 'Roof Mount' })
  @IsString()
  mountingType: string
}
