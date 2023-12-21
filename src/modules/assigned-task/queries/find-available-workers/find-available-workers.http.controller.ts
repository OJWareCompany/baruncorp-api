import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { AuthGuard } from '../../../auth/authentication.guard'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { UserEntity } from '../../../users/domain/user.entity'
import { QueryBus } from '@nestjs/cqrs'
import { FindAvailableWorkersQuery } from './find-available-workers.query.handler'
import { FindAvailableWorkersRequestParamDto } from './find-available-workers.request.dto'
import { AvailableWorkerResponseDto } from '../../dtos/available-worker.response.dto'

@Controller('assigned-tasks')
export class FindAvailableWorkersHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':assignedTaskId/available-tasks')
  @UseGuards(AuthGuard)
  async get(
    @User() user: UserEntity,
    @Param() param: FindAvailableWorkersRequestParamDto,
  ): Promise<AvailableWorkerResponseDto[]> {
    const query = new FindAvailableWorkersQuery({ assignedTaskId: param.assignedTaskId })
    // const result = await this.queryBus.execute(query)
    return [
      { id: 'sd1', name: 'chris kim1', position: 'Sr. Designer' },
      { id: 'sd2', name: 'chris kim2', position: 'Jr. Designer' },
      { id: 'sd3', name: 'chris kim3', position: 'Sr. EIT' },
      { id: 'sd4', name: 'chris kim4', position: 'Jr. EIT' },
    ]
  }
}
