import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'
import {
  MountingTypeEnum,
  ProjectPropertyType,
  ProjectPropertyTypeEnum,
} from '../../../modules/project/domain/project.type'
import { JobResponseDto } from '../../ordered-job/dtos/job.response.dto'
import { AddressResponseDto } from '../../ordered-job/dtos/address.response.dto'

export class ProjectAssociatedRegulatoryBodyDto {
  @ApiProperty({ default: '12' })
  @IsString()
  readonly stateId: string

  @ApiProperty({ default: '12011' })
  @IsString()
  @IsOptional()
  readonly countyId: string | null

  @ApiProperty({ default: '1201191098' })
  @IsString()
  @IsOptional()
  readonly countySubdivisionsId: string | null

  @ApiProperty({ default: '1239525' })
  @IsString()
  @IsOptional()
  readonly placeId: string | null

  @ApiProperty({ default: '1239525' })
  @IsString()
  readonly ahjId: string
}

export class ProjectResponseDto {
  @ApiProperty({ example: '07e12e89-6077-4fd1-a029-c50060b57f43' })
  projectId: string

  @ApiProperty({ example: 201.0 })
  systemSize: number | null

  @ApiProperty({ example: 'Kevin Brook' })
  projectPropertyOwnerName: string | null

  @ApiProperty({ enum: MountingTypeEnum, example: 'Ground Mount' })
  mountingType: MountingTypeEnum

  @ApiProperty({ example: 'Barun Corp' })
  clientOrganization: string

  @ApiProperty({ example: 'eaefe251-0f1f-49ac-88cb-3582ec76601d' })
  clientOrganizationId: string

  @ApiProperty({ example: 'https://host.com/projects/path' })
  projectFolderLink: string | null

  @ApiProperty({ example: AddressResponseDto })
  propertyAddress: AddressResponseDto

  @ApiProperty({ example: AddressResponseDto })
  mailingAddressForWetStamp: AddressResponseDto | null

  @ApiProperty({ example: 3 })
  numberOfWetStamp: number | null

  @ApiProperty({ enum: ProjectPropertyTypeEnum, example: 'Residential' })
  propertyType: ProjectPropertyType

  @ApiProperty({ example: null })
  projectNumber: string | null

  @ApiProperty({ example: '2023-09-05T07:14:57.270Z' })
  createdAt: string

  @ApiProperty({ example: ProjectAssociatedRegulatoryBodyDto })
  projectAssociatedRegulatoryBody: ProjectAssociatedRegulatoryBodyDto | null

  @ApiProperty({ example: 1 })
  totalOfJobs: number

  @ApiProperty({ example: false })
  masterLogUpload: boolean

  @ApiProperty({ example: false })
  designOrPEStampPreviouslyDoneOnProjectOutSide: boolean

  @ApiProperty({ example: false })
  hasHistoryElectricalPEStamp: boolean

  @ApiProperty({ example: false })
  hasHistoryStructuralPEStamp: boolean

  @ApiProperty({ example: [] })
  jobs: JobResponseDto[]
}
