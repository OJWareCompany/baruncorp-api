import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { UserEntity } from '../../../users/domain/user.entity'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { RejectedTaskReasonPaginatedResponseDto } from '../../dtos/rejected-task-reason.response.dto'
import { QueryBus } from '@nestjs/cqrs'
import { FindRejectedTaskReasonPaginatedQuery } from './find-rejected-task-reason.paginated.query-handler'
import { Paginated, PaginatedQueryParams } from '../../../../libs/ddd/repository.port'
import { FindRejectedTaskReasonPaginatedRequestDto } from './find-rejected-task-reason.paginated.request.dto'
import { RejectedTaskReasons } from '@prisma/client'

@Controller('rejected-task-reasons')
export class FindRejectedTaskReasonHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('')
  @UseGuards(AuthGuard)
  async get(
    @User() user: UserEntity,
    @Param() queryParams: PaginatedQueryParams,
    @Query() request: FindRejectedTaskReasonPaginatedRequestDto,
  ): Promise<RejectedTaskReasonPaginatedResponseDto> {
    const query = new FindRejectedTaskReasonPaginatedQuery({
      limit: queryParams.limit,
      page: queryParams.page,
      username: request.userName,
    })
    const result: Paginated<RejectedTaskReasons> = await this.queryBus.execute(query)

    return new RejectedTaskReasonPaginatedResponseDto({
      page: result.page,
      pageSize: result.pageSize,
      totalCount: result.totalCount,
      items: result.items.map((item) => {
        return {
          userId: item.assigneeUserId,
          userName: item.assigneeUserName,
          taskName: item.taskName,
          rejectedTaskId: item.assignedTaskId,
          rejectedAt: item.rejectedAt,
          reason: item.reason,
        }
      }),
    })
  }
}
