import { Controller, Get, HttpStatus, Param } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { QueryBus } from '@nestjs/cqrs'
import { FindProjectDetailQuery } from './find-project-detail.query-handler'
import { FindProjectDetailRequestDto } from './find-project-detail.request.dto'
import { ProjectResponseDto } from '../../dtos/project.response.dto'
import { OrderedJobs, OrderedProjects } from '@prisma/client'
import { OrganizationModel } from '../../../../modules/organization/database/organization.repository'
import { JobProps } from '@src/modules/ordered-job/domain/job.type'

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
    const result: Partial<OrderedProjects> & { organization: Partial<OrganizationModel> } & { jobs: JobProps } =
      await this.queryBus.execute(query)

    // Whitelisting returned properties
    const response = new ProjectResponseDto()
    response.projectId = result.id
    response.systemSize = Number(result.systemSize)
    response.isGroundMount = result.isGroundMount
    response.projectPropertyOwnerName = result.propertyOwnerName
    response.clientOrganization = result.organization.name
    response.clientOrganizationId = result.organization.id
    response.clientUserId = result.clientUserId
    response.clientUserName = result.clientUserName
    response.projectFolderLink = result.projectFolder
    response.mailingAddressForWetStamp = result.mailingAddressForWetStamps
    response.propertyAddress = result.propertyAddress
    response.numberOfWetStamp = result.numberOfWetStamps
    response.propertyType = result.projectPropertyType === 'Residential' ? 'Residential' : 'Commercial'
    response.projectNumber = result.projectNumber
    response.createdAt = result.dateCreated.toISOString()
    response.totalOfJobs = result.totalOfJobs
    response.masterLogUpload = result.masterLogUpload
    response.designOrPEStampPreviouslyDoneOnProjectOutSide = !!result.designOrPeStampPreviouslyDoneOnProjectOutside
    response.jobs = result.jobs
    return response
  }
}
