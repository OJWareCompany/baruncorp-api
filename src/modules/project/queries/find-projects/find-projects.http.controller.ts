import { Controller, Get, HttpStatus, Query } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { QueryBus } from '@nestjs/cqrs'
import { OrderedProjects } from '@prisma/client'
import { ProjectPaginatedResponseDto } from '../../dtos/project.paginated.response.dto'
import { PaginatedQueryRequestDto } from '../../../../libs/ddd/paginated-query.request.dto'
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
      limit: queryParams?.limit,
      page: queryParams?.page,
    })

    const result: Paginated<OrderedProjects> = await this.queryBus.execute(query)

    // Whitelisting returned properties
    return new ProjectPaginatedResponseDto({
      ...result,
      items: result.items.map((projects) => ({
        projectId: projects.id,
        propertyType: projects.projectPropertyType as ProjectPropertyType,
        projectFolderLink: projects.projectFolder,
        projectNumber: projects.projectNumber,
        propertyAddress: projects.propertyAddress,
        createdAt: projects.dateCreated.toISOString(),
        totalOfJobs: projects.totalOfJobs,
        masterLogUpload: !!projects.masterLogUpload,
        designOrPEStampPreviouslyDoneOnProjectOutSide: !!projects.designOrPeStampPreviouslyDoneOnProjectOutside,
        mountingType: projects.mountingType as MountingTypeEnum,
      })),
    })
  }
}
