import { Controller, Get, HttpStatus, Query } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { QueryBus } from '@nestjs/cqrs'
import { OrderedProjects, Organizations } from '@prisma/client'
import { ProjectPaginatedResponseDto } from '../../dtos/project.paginated.response.dto'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { FindProjectsQuery } from './find-projects.query-handler'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { FindProjectsRequestDto } from './find-projects.request.dto'
import { MountingTypeEnum, ProjectPropertyType } from '../../domain/project.type'

@Controller('projects')
export class FindProjectsHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('')
  @ApiOperation({ summary: 'Find projects' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ProjectPaginatedResponseDto,
  })
  async findUsers(
    @Query() searchQuery: FindProjectsRequestDto,
    @Query() queryParams: PaginatedQueryRequestDto,
  ): Promise<ProjectPaginatedResponseDto> {
    const query = new FindProjectsQuery({
      ...searchQuery,
      propertyType: searchQuery.propertyType,
      projectNumber: searchQuery.projectNumber,
      propertyFullAddress: searchQuery.propertyFullAddress,
      organizationId: searchQuery.organizationId,
      limit: queryParams?.limit,
      page: queryParams?.page,
    })
    const result: Paginated<{ organization: Organizations } & OrderedProjects> = await this.queryBus.execute(query)

    // Whitelisting returned properties
    return new ProjectPaginatedResponseDto({
      ...result,
      items: result.items.map((project) => ({
        projectId: project.id,
        organizationId: project.clientOrganizationId,
        organizationName: project.organization.name,
        propertyOwnerName: project.propertyOwnerName,
        propertyType: project.projectPropertyType as ProjectPropertyType,
        projectFolderLink: project.projectFolder,
        projectNumber: project.projectNumber,
        propertyFullAddress: project.propertyFullAddress,
        createdAt: project.dateCreated.toISOString(),
        totalOfJobs: project.totalOfJobs,
        masterLogUpload: !!project.masterLogUpload,
        designOrPEStampPreviouslyDoneOnProjectOutSide: !!project.designOrPeStampPreviouslyDoneOnProjectOutside,
        mountingType: project.mountingType as MountingTypeEnum,
      })),
    })
  }
}
