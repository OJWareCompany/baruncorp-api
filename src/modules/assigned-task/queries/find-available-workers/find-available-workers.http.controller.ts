import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { UserEntity } from '../../../users/domain/user.entity'
import { QueryBus } from '@nestjs/cqrs'
import { FindAvailableWorkersQuery } from './find-available-workers.query.handler'
import { FindAvailableWorkersRequestParamDto } from './find-available-workers.request.dto'
import { AvailableWorkerResponseDto } from '../../dtos/available-worker.response.dto'
import { UserPosition, Users } from '@prisma/client'

@Controller('assigned-tasks')
export class FindAvailableWorkersHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':assignedTaskId/available-workers')
  @UseGuards(AuthGuard)
  async get(
    @User() user: UserEntity,
    @Param() param: FindAvailableWorkersRequestParamDto,
  ): Promise<AvailableWorkerResponseDto[]> {
    const query = new FindAvailableWorkersQuery({ assignedTaskId: param.assignedTaskId })
    const result: (Users & { userPosition: UserPosition | null })[] = await this.queryBus.execute(query)
    return result.map((user) => {
      return {
        id: user.id,
        name: user.full_name,
        position: user.userPosition ? user.userPosition.positionName : null,
      }
    })
  }
}
