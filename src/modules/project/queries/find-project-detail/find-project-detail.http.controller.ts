import { Controller, Get, HttpStatus, Param } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { QueryBus } from '@nestjs/cqrs'
import { ProjectResponseDto } from '../../dtos/project.response.dto'
import { Address } from '../../../organization/domain/value-objects/address.vo'
import { FindProjectDetailQuery } from './find-project-detail.query-handler'
import { FindProjectDetailRequestDto } from './find-project-detail.request.dto'
import { ProjectAssociatedRegulatoryBody } from '../../domain/value-objects/project-associated-regulatory-body.value-object'

@Controller('projects')
export class FindProjectDetailHttpController {
  constructor(private readonly queryBus: QueryBus) {}

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
    const result: { record: any; currentMailingAddress: Address } =
      // const result: Partial<OrderedProjects> & { organization: Partial<OrganizationModel> } & { jobs: JobProps[] } =
      await this.queryBus.execute(query)

    // Whitelisting returned properties
    const response = new ProjectResponseDto()
    response.projectId = result.record.id!
    response.systemSize = result.record.systemSize ? Number(result.record.systemSize) : null
    response.projectPropertyOwnerName = result.record.propertyOwnerName
    response.clientOrganization = result.record.organization.name!
    response.clientOrganizationId = result.record.organization.id!
    response.projectFolderLink = result.record.projectFolder || null

    response.numberOfWetStamp = result.record.numberOfWetStamps!
    response.propertyType = result.record.projectPropertyType === 'Residential' ? 'Residential' : 'Commercial'
    response.projectNumber = result.record.projectNumber || null
    response.createdAt = result.record.dateCreated!.toISOString()!
    response.totalOfJobs = result.record.totalOfJobs!
    response.masterLogUpload = !!result.record.masterLogUpload
    response.designOrPEStampPreviouslyDoneOnProjectOutSide =
      !!result.record.designOrPeStampPreviouslyDoneOnProjectOutside
    response.hasHistoryElectricalPEStamp = !!result.record.hasHistoryElectricalPEStamp
    response.hasHistoryStructuralPEStamp = !!result.record.hasHistoryStructuralPEStamp
    response.jobs = result.record.jobs
    response.propertyAddress = new Address({
      city: result.record.propertyAddressCity,
      country: result.record.propertyAddressCountry,
      postalCode: result.record.propertyAddressPostalCode,
      state: result.record.propertyAddressState,
      street1: result.record.propertyAddressStreet1,
      street2: result.record.propertyAddressStreet2,
      fullAddress: result.record.propertyFullAddress,
      coordinates: result.record.propertyAddressCoordinates.split(',').map((n) => Number(n)),
    })
    response.mailingAddressForWetStamp = !result.currentMailingAddress
      ? null
      : new Address({
          city: result.currentMailingAddress?.city,
          country: result.currentMailingAddress?.country,
          postalCode: result.currentMailingAddress?.postalCode,
          state: result.currentMailingAddress?.state,
          street1: result.currentMailingAddress?.street1,
          street2: result.currentMailingAddress?.street2,
          fullAddress: result.currentMailingAddress?.fullAddress,
          coordinates: result.currentMailingAddress?.coordinates,
        })

    response.projectAssociatedRegulatoryBody = new ProjectAssociatedRegulatoryBody({
      stateId: result.record?.stateId || null,
      countyId: result.record?.countyId || null,
      countySubdivisionsId: result.record?.countySubdivisionsId || null,
      placeId: result.record?.placeId || null,
    })

    console.log(response.projectAssociatedRegulatoryBody)
    return response
  }
}
