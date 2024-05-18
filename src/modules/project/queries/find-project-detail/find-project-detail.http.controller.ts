import { Controller, Get, HttpStatus, Param } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { QueryBus } from '@nestjs/cqrs'
import { Address } from '../../../organization/domain/value-objects/address.vo'
import { ProjectAssociatedRegulatoryBody } from '../../domain/value-objects/project-associated-regulatory-body.value-object'
import { ProjectResponseDto } from '../../dtos/project.response.dto'
import { ProjectPropertyTypeEnum } from '../../domain/project.type'
import { FindProjectDetailQuery, FindProjectDetailReturnType } from './find-project-detail.query-handler'
import { FindProjectDetailRequestDto } from './find-project-detail.request.dto'
import { JobResponseMapper } from '../../../ordered-job/job.response.mapper'
import { OrderedJobs } from '@prisma/client'

@Controller('projects')
export class FindProjectDetailHttpController {
  constructor(private readonly queryBus: QueryBus, private readonly jobResponseMapper: JobResponseMapper) {}

  @Get(':projectId')
  @ApiOperation({ summary: 'Find projects' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ProjectResponseDto,
  })
  async findProjectDetail(@Param() searchQuery: FindProjectDetailRequestDto): Promise<ProjectResponseDto> {
    const query = new FindProjectDetailQuery({
      id: searchQuery.projectId,
    })

    const result: FindProjectDetailReturnType = await this.queryBus.execute(query)

    const jobHasCurrentMailingAddress = result.jobs.find((job) => job.mailingAdderssCoordinates)
    const mailingAddressForWetStamp = jobHasCurrentMailingAddress || null
    const currentMailingAddress: Address | null =
      !!mailingAddressForWetStamp && this.isAddressValid(mailingAddressForWetStamp)
        ? new Address({
            city: mailingAddressForWetStamp.mailingAdderssCity!,
            country: mailingAddressForWetStamp.mailingAdderssPostalCountry,
            postalCode: mailingAddressForWetStamp.mailingAdderssPostalCode!,
            state: mailingAddressForWetStamp.mailingAdderssState,
            street1: mailingAddressForWetStamp.mailingAdderssStreet1!,
            street2: mailingAddressForWetStamp.mailingAdderssStreet2,
            fullAddress: mailingAddressForWetStamp.mailingFullAddressForWetStamp!,
            coordinates: mailingAddressForWetStamp.mailingAdderssCoordinates!.split(',').map((n) => Number(n)),
          })
        : null

    const jobsResponse = await Promise.all(result.jobs.map((job) => this.jobResponseMapper.toResponse(job))) // job을 생략하면 undefined 됨

    const response = new ProjectResponseDto()
    response.projectId = result.id

    response.jobs = jobsResponse

    response.systemSize = result.systemSize ? Number(result.systemSize) : null
    response.projectPropertyOwnerName = result.propertyOwnerName
    response.clientOrganization = result.organization?.name || 'unknown'
    response.clientOrganizationId = result.organization?.id || 'unknown'
    response.projectFolderLink = result.projectFolder || null

    response.numberOfWetStamp = result.numberOfWetStamps
    response.propertyType = result.projectPropertyType as ProjectPropertyTypeEnum
    response.projectNumber = result.projectNumber || null
    response.createdAt = result.dateCreated.toISOString()
    response.totalOfJobs = result.totalOfJobs
    response.masterLogUpload = !!result.masterLogUpload
    response.designOrPEStampPreviouslyDoneOnProjectOutSide = !!result.designOrPeStampPreviouslyDoneOnProjectOutside
    response.hasHistoryElectricalPEStamp = !!result.hasHistoryElectricalPEStamp
    response.hasHistoryStructuralPEStamp = !!result.hasHistoryStructuralPEStamp
    response.propertyAddress = new Address({
      city: result.propertyAddressCity,
      country: result.propertyAddressCountry,
      postalCode: result.propertyAddressPostalCode,
      state: result.propertyAddressState,
      street1: result.propertyAddressStreet1,
      street2: result.propertyAddressStreet2,
      fullAddress: result.propertyFullAddress,
      coordinates: result.propertyAddressCoordinates.split(',').map((n) => Number(n)),
    })
    response.mailingAddressForWetStamp = currentMailingAddress

    response.projectAssociatedRegulatoryBody = new ProjectAssociatedRegulatoryBody({
      stateId: result.stateId,
      countyId: result.countyId || null,
      countySubdivisionsId: result.countySubdivisionsId || null,
      placeId: result.placeId || null,
    })
    response.utilityId = result.utilityId

    response.projectFolderId = result.projectFolderId ?? null
    response.shareLink = result.shareLink ?? null
    response.parentlessFolder = result.parentless ?? false
    response.sharedDriveVersion = result.sharedDriveVersion ?? null

    return response
  }

  private isAddressValid(job: OrderedJobs) {
    return (
      !!job.mailingAdderssCity &&
      !!job.mailingAdderssPostalCountry &&
      !!job.mailingAdderssPostalCode &&
      !!job.mailingAdderssState &&
      !!job.mailingAdderssStreet1 &&
      !!job.mailingFullAddressForWetStamp &&
      !!job.mailingAdderssCoordinates
    )
  }
}
