import { Controller, Get, HttpStatus, Query } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { QueryBus } from '@nestjs/cqrs'
import { orderedProjects } from '@prisma/client'
import { ProjectPaginatedResponseDto } from '../../dtos/project.paginated.response.dto'
import { PaginatedQueryRequestDto } from '../../../../libs/ddd/paginated-query.request.dto'
import { FindProjectsQuery } from './find-projects.query-handler'
import { FindProjectsQueryRequestDto } from './find-projects.request.dto'
import { Paginated } from '../../../../libs/ddd/repository.port'

@Controller('projects')
export class FindUsersHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('')
  @ApiOperation({ summary: 'Find projects' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ProjectPaginatedResponseDto,
  })
  async findUsers(
    @Query() searchQuery: FindProjectsQueryRequestDto,
    @Query() queryParams: PaginatedQueryRequestDto,
  ): Promise<ProjectPaginatedResponseDto> {
    const query = new FindProjectsQuery({
      ...searchQuery,
      limit: queryParams?.limit,
      page: queryParams?.page,
    })

    const result: Paginated<orderedProjects> = await this.queryBus.execute(query)

    // Whitelisting returned properties
    return new ProjectPaginatedResponseDto({
      ...result,
      items: result.items.map((projects) => ({
        propertyType: projects.projectPropertyType,
        projectFolderLink: projects.projectFolder,
        projectNumber: projects.projectNumber,
        propertyAddress: projects.propertyAddress,
        createdAt: projects.dateCreated.toISOString(),
        totalOfJobs: projects.totalOfJobs,
        masterLogUpload: !!projects.masterLogUpload,
        designOrPEStampPreviouslyDoneOnProjectOutSide: !!projects.designOrPeStampPreviouslyDoneOnProjectOutside,
      })),
    })
  }
}
