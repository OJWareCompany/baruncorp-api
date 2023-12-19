import { Controller, Get, Query, Param } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { FindUnregisteredUsersForTaskPaginatedQuery } from './find-unregistered-users-for-task.query-handler'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { FindUnregisteredUsersForTaskPaginatedRequestParamDto } from './find-unregistered-users-for-task.request.dto'
import { UnregisteredUserForTaskPaginatedResponseDto } from '../../dtos/unregistered-user-for-task.paginated.response'

@Controller('tasks')
export class FindUnregisteredUsersForTaskHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':taskId/unregistered-users')
  async get(
    @Param() param: FindUnregisteredUsersForTaskPaginatedRequestParamDto,
    @Query() queryParams: PaginatedQueryRequestDto,
  ): Promise<UnregisteredUserForTaskPaginatedResponseDto> {
    const command = new FindUnregisteredUsersForTaskPaginatedQuery({ taskId: param.taskId })

    // const result: Paginated<Tasks> = await this.queryBus.execute(command)
    return new UnregisteredUserForTaskPaginatedResponseDto({
      page: 1,
      pageSize: 1,
      totalCount: 1,
      items: [
        {
          userId: 'asdasd',
          userName: 'chris kim',
        },
        {
          userId: 'a2eda3w2',
          userName: 'hyomin kim',
        },
        {
          userId: 'q3daa2d21',
          userName: 'yunwoo ji',
        },
      ],
    })
  }
}
