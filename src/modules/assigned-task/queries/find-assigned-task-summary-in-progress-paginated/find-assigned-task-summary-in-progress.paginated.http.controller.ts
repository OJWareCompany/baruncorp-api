import { Controller, Get, Query } from '@nestjs/common'
import { AssignedTasks } from '@prisma/client'
import { ApiOperation } from '@nestjs/swagger'
import { QueryBus } from '@nestjs/cqrs'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { MountingTypeEnum, ProjectPropertyTypeEnum } from '../../../project/domain/project.type'
import { FindAssignedTaskSummaryInProgressPaginatedRequestDto } from './find-assigned-task-summary-in-progress.paginated.request.dto'
import { FindAssignedTaskSummaryPaginatedQuery } from './find-assigned-task-summary-in-progress.paginated.query-handler'
import { PrerequisiteTaskVO } from '../../../ordered-job/domain/value-objects/assigned-task.value-object'
import { AssignedTaskSummaryPaginatedResponseDto } from '../../dtos/assigned-task-summary.paginated.response.dto'
import { PtoResponseDto } from '@modules/pto/dtos/pto.response.dto'
import { AssignedTaskSummaryResponseDto } from '@modules/assigned-task/dtos/assigned-task-summary.response.dto'

@Controller('assigned-tasks')
export class FindAssignedTaskSummaryInProgressPaginatedHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('summary/count/in-progress')
  async get(
    @Query() request: FindAssignedTaskSummaryInProgressPaginatedRequestDto,
    @Query() queryParams: PaginatedQueryRequestDto,
  ): Promise<AssignedTaskSummaryPaginatedResponseDto> {
    const query = new FindAssignedTaskSummaryPaginatedQuery({
      ...request,
      ...queryParams,
    })

    const result: Paginated<AssignedTaskSummaryResponseDto> = await this.queryBus.execute(query)

    return new AssignedTaskSummaryPaginatedResponseDto({
      ...queryParams,
      ...result,
      items: result.items,
    })
  }
}
