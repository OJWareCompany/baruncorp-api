import { ApiProperty } from '@nestjs/swagger'
import {
  MountingTypeEnum,
  ProjectPropertyType,
  ProjectPropertyTypeEnum,
} from '../../../modules/project/domain/project.type'
import { JobProps, JobStatus, JobStatusEnum } from '../../ordered-job/domain/job.type'
import { ClientInformation } from '../../ordered-job/domain/value-objects/client-information.value-object'
import { OrderedTask } from '../../ordered-job/domain/value-objects/ordered-task.value-object'
import { Address } from '../../organization/domain/value-objects/address.vo'
import { IsOptional } from 'class-validator'
import { ProjectAssociatedRegulatoryBody } from '../domain/value-objects/project-associated-regulatory-body.value-object'

class Jobs implements JobProps {
  @ApiProperty()
  id: string
  @ApiProperty()
  projectId: string
  @ApiProperty()
  projectType: string
  @ApiProperty()
  mountingType: string
  @ApiProperty()
  jobName: string
  @ApiProperty({ enum: JobStatusEnum, example: JobStatusEnum.In_Progress })
  jobStatus: JobStatus
  @ApiProperty()
  propertyFullAddress: string
  @ApiProperty()
  isExpedited: boolean
  @ApiProperty()
  jobRequestNumber: number
  @ApiProperty()
  orderedTasks: OrderedTask[]
  @ApiProperty()
  systemSize: number
  @ApiProperty()
  @IsOptional()
  mailingAddressForWetStamp: Address | null
  @ApiProperty()
  numberOfWetStamp: number
  @ApiProperty()
  additionalInformationFromClient: string
  @ApiProperty()
  clientInfo: ClientInformation
  @ApiProperty()
  updatedBy: string
  @ApiProperty()
  receivedAt: Date
  @ApiProperty()
  isCurrentJob?: boolean
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

  @ApiProperty({ example: Address })
  propertyAddress: Address | null

  @ApiProperty({ example: Address })
  mailingAddressForWetStamp: Address | null

  @ApiProperty({ example: 3 })
  numberOfWetStamp: number | null

  @ApiProperty({ enum: ProjectPropertyTypeEnum, example: 'Residential' })
  propertyType: ProjectPropertyType

  @ApiProperty({ example: null })
  projectNumber: string | null

  @ApiProperty({ example: '2023-09-05T07:14:57.270Z' })
  createdAt: string

  @ApiProperty({ example: ProjectAssociatedRegulatoryBody })
  projectAssociatedRegulatoryBody: ProjectAssociatedRegulatoryBody | null

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
  jobs: Jobs[]
}
