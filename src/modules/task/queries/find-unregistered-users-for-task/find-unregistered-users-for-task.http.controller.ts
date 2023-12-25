import { Controller, Get, Query, Param } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { FindUnregisteredUsersForTaskPaginatedQuery } from './find-unregistered-users-for-task.query-handler'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { FindUnregisteredUsersForTaskPaginatedRequestParamDto } from './find-unregistered-users-for-task.request.dto'
import { UnregisteredUserForTaskPaginatedResponseDto } from '../../dtos/unregistered-user-for-task.paginated.response'
import { Users } from '@prisma/client'
import { Paginated } from '../../../../libs/ddd/repository.port'

@Controller('tasks')
export class FindUnregisteredUsersForTaskHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':taskId/unregistered-users')
  async get(
    @Param() param: FindUnregisteredUsersForTaskPaginatedRequestParamDto,
    @Query() queryParams: PaginatedQueryRequestDto,
  ): Promise<UnregisteredUserForTaskPaginatedResponseDto> {
    const command = new FindUnregisteredUsersForTaskPaginatedQuery({ taskId: param.taskId })
    const result: Paginated<Users> = await this.queryBus.execute(command)

    return new UnregisteredUserForTaskPaginatedResponseDto({
      page: result.page,
      pageSize: result.pageSize,
      totalCount: result.totalCount,
      items: result.items.map((user) => {
        return {
          userId: user.id,
          userName: user.firstName + ' ' + user.lastName,
        }
      }),
    })
  }
}
