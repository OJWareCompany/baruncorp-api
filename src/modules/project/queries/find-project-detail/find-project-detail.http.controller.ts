import { Controller, Get, HttpStatus, Param } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { QueryBus } from '@nestjs/cqrs'
import { Address } from '../../../organization/domain/value-objects/address.vo'
import { JobMapper } from '../../../ordered-job/job.mapper'
import { ProjectAssociatedRegulatoryBody } from '../../domain/value-objects/project-associated-regulatory-body.value-object'
import { ProjectResponseDto } from '../../dtos/project.response.dto'
import { ProjectPropertyType } from '../../domain/project.type'
import { FindProjectDetailQuery, FindProjectDetailReturnType } from './find-project-detail.query-handler'
import { FindProjectDetailRequestDto } from './find-project-detail.request.dto'
import { PrismaService } from '../../../database/prisma.service'

@Controller('projects')
export class FindProjectDetailHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly prismaService: PrismaService,
    private readonly jobMapper: JobMapper,
  ) {}

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
    const prerequisiteTasks = await this.prismaService.prerequisiteTasks.findMany()

    const jobEntities = result.jobs.map((job) => this.jobMapper.toDomain({ ...job, prerequisiteTasks }))
    const jobHasCurrentMailingAddress = jobEntities.find((entity) => entity.hasCurrentMailingAddress())
    const mailingAddressForWetStamp = jobHasCurrentMailingAddress?.getProps().mailingAddressForWetStamp || null
    const currentMailingAddress: Address | null = mailingAddressForWetStamp
      ? new Address({
          city: mailingAddressForWetStamp.city,
          country: mailingAddressForWetStamp.country,
          postalCode: mailingAddressForWetStamp.postalCode,
          state: mailingAddressForWetStamp.state,
          street1: mailingAddressForWetStamp.street1,
          street2: mailingAddressForWetStamp.street2,
          fullAddress: mailingAddressForWetStamp.fullAddress,
          coordinates: mailingAddressForWetStamp.coordinates,
        })
      : null

    const jobsResponse = result.jobs
      .map((job) => this.jobMapper.toDomain({ ...job, prerequisiteTasks }))
      .map(this.jobMapper.toResponse)

    const response = new ProjectResponseDto()
    response.projectId = result.id

    response.jobs = jobsResponse

    response.systemSize = result.systemSize ? Number(result.systemSize) : null
    response.projectPropertyOwnerName = result.propertyOwnerName
    response.clientOrganization = result.organization?.name || 'unknown'
    response.clientOrganizationId = result.organization?.id || 'unknown'
    response.projectFolderLink = result.projectFolder || null

    response.numberOfWetStamp = result.numberOfWetStamps
    response.propertyType = result.projectPropertyType as ProjectPropertyType // TODO: type
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

    return response
  }
}
