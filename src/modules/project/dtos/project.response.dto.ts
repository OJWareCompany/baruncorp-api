import { ApiProperty } from '@nestjs/swagger'
import { MountingTypeEnum, ProjectPropertyType } from '../../../modules/project/domain/project.type'
import { JobProps } from '@src/modules/ordered-job/domain/job.type'

export class ProjectResponseDto {
  @ApiProperty({ example: '07e12e89-6077-4fd1-a029-c50060b57f43' })
  projectId: string

  @ApiProperty({ example: 201.0 })
  systemSize: number | null

  @ApiProperty({ example: true })
  isGroundMount: boolean

  @ApiProperty({ example: 'Kevin Brook' })
  projectPropertyOwnerName: string

  @ApiProperty({ enum: MountingTypeEnum, example: 'Ground Mount' })
  mountingType: MountingTypeEnum

  @ApiProperty({ example: 'Barun Corp' })
  clientOrganization: string

  @ApiProperty({ example: 'eaefe251-0f1f-49ac-88cb-3582ec76601d' })
  clientOrganizationId: string

  @ApiProperty({ example: '07ec8e89-6877-4fa1-a029-c58360b57f43' })
  clientUserId: string

  @ApiProperty({ example: 'Chris Kim' })
  clientUserName: string

  @ApiProperty({ example: 'https://host.com/projects/path' })
  projectFolderLink: string | null

  @ApiProperty({ example: '3480 Northwest 33rd Court, Lauderdale Lakes, Florida 33309' })
  mailingAddressForWetStamp: string

  @ApiProperty({ example: [11.2, 22.1] })
  coordinates: number[]

  @ApiProperty({ example: '3480 Northwest 33rd Court, Lauderdale Lakes, Florida 33309' })
  propertyAddress: string

  @ApiProperty({ example: 3 })
  numberOfWetStamp: number | null

  @ApiProperty({ example: 'Residential' })
  propertyType: ProjectPropertyType

  @ApiProperty({ example: null })
  projectNumber: string | null

  @ApiProperty({ example: new Date() })
  createdAt: string

  @ApiProperty({ example: 1 })
  totalOfJobs: number

  @ApiProperty({ example: false })
  masterLogUpload: boolean

  @ApiProperty({ example: false })
  designOrPEStampPreviouslyDoneOnProjectOutSide: boolean

  @ApiProperty({ example: {} })
  jobs: JobProps | null
}
