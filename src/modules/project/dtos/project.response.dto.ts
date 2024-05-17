import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'
import { MountingTypeEnum, ProjectPropertyTypeEnum } from '../../../modules/project/domain/project.type'
import { JobResponseDto } from '../../ordered-job/dtos/job.response.dto'
import { AddressDto } from '../../ordered-job/dtos/address.dto'

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

  @ApiProperty({ example: AddressDto })
  propertyAddress: AddressDto

  @ApiProperty({ example: AddressDto })
  mailingAddressForWetStamp: AddressDto | null

  @ApiProperty({ example: 3 })
  numberOfWetStamp: number | null

  @ApiProperty({ enum: ProjectPropertyTypeEnum, example: 'Residential' })
  propertyType: ProjectPropertyTypeEnum

  @ApiProperty({ example: null })
  projectNumber: string | null

  @ApiProperty({ example: '2023-09-05T07:14:57.270Z' })
  createdAt: string

  @ApiProperty({ example: ProjectAssociatedRegulatoryBodyDto })
  projectAssociatedRegulatoryBody: ProjectAssociatedRegulatoryBodyDto

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

  @ApiProperty({ example: 'eaefe251-0f1f-49ac-88cb-3582ec76601d' })
  utilityId: string | null

  @ApiProperty({ example: [] })
  jobs: JobResponseDto[]

  @ApiProperty({ example: 'GnpyEmUZfZ1k7e6Jsvy_fcG8r-PWCQswP' })
  @IsString()
  projectFolderId: string | null

  @ApiProperty({ example: 'https://drive.google.com/drive/folders/Qzjm63Ja6SAezk1QT0kUcC1x7Oo3gn8WL' })
  @IsString()
  shareLink: string | null

  @ApiProperty({ example: false })
  parentlessFolder?: boolean
}
