import { Controller, Get, HttpStatus, Query } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { FindNonCountedJobFoldersRequestDto } from './find-non-counted-job-folders.request.param.dto'
import { JobFolderPaginatedResponseDto } from '../../dtos/job-folder.paginated.response.dto'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { FindNonCountedJobFoldersQuery } from './find-non-counted-job-folders.query-handler'

@Controller('non-counted-job-folder')
export class FindNonCountedJobFoldersHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('')
  @ApiOperation({ summary: 'Find non-counted-job-folder' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: JobFolderPaginatedResponseDto,
  })
  async findNonCountedJobFolders(
    @Query() searchQuery: FindNonCountedJobFoldersRequestDto,
    @Query() queryParams: PaginatedQueryRequestDto,
  ): Promise<JobFolderPaginatedResponseDto> {
    const query = new FindNonCountedJobFoldersQuery({
      ...searchQuery,
      limit: queryParams?.limit,
      page: queryParams?.page,
    })
    const result: JobFolderPaginatedResponseDto = await this.queryBus.execute(query)
    return result
  }
}
