import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { AssigningTaskAlerts } from '@prisma/client'
import { QueryBus } from '@nestjs/cqrs'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { FindAssigningTaskAlertPaginatedQuery } from './find-assigning-task-alert.paginated.query-handler'

@Controller('assigning-task-alerts')
export class FindAssigningTaskAlertPaginatedHttpController {
  constructor(private readonly queryBus: QueryBus) {}
  @UseGuards(AuthGuard)
  @Get('')
  async find(@User() user: UserEntity, @Query() queryParams: PaginatedQueryRequestDto) {
    const query = new FindAssigningTaskAlertPaginatedQuery({
      ...queryParams,
      userId: user.id,
    })
    const result: Paginated<AssigningTaskAlerts> = await this.queryBus.execute(query)
    return result
  }
}
