import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { AssigningTaskAlerts } from '@prisma/client'
import { QueryBus } from '@nestjs/cqrs'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { FindAssigningTaskAlertPaginatedQuery } from './find-assigning-task-alert.paginated.query-handler'
import { AssigningTaskAlertPaginatedResponse } from '../../dto/assigning-task-alert.response.dto'
import { MountingTypeEnum, ProjectPropertyTypeEnum } from '../../../project/domain/project.type'

@Controller('assigning-task-alerts')
export class FindAssigningTaskAlertPaginatedHttpController {
  constructor(private readonly queryBus: QueryBus) {}
  @UseGuards(AuthGuard)
  @Get('')
  async find(
    @User() user: UserEntity,
    @Query() queryParams: PaginatedQueryRequestDto,
  ): Promise<AssigningTaskAlertPaginatedResponse> {
    const query = new FindAssigningTaskAlertPaginatedQuery({
      ...queryParams,
      userId: user.id,
    })
    const result: Paginated<AssigningTaskAlerts> = await this.queryBus.execute(query)
    return new AssigningTaskAlertPaginatedResponse({
      page: result.page,
      pageSize: result.pageSize,
      totalCount: result.totalCount,
      items: result.items.map((item) => {
        return {
          id: item.id,
          userId: item.userId,
          userName: item.userName,
          assignedTaskId: item.assignedTaskId,
          taskName: item.taskName,
          jobId: item.jobId,
          projectPropertyType: item.projectPropertyType as ProjectPropertyTypeEnum,
          mountingType: item.mountingType as MountingTypeEnum,
          isRevision: item.isRevision,
          note: item.note,
          createdAt: item.createdAt,
          isCheckedOut: item.isCheckedOut,
        }
      }),
    })
  }
}
