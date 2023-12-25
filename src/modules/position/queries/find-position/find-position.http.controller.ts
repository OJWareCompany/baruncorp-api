import { Controller, Get, Param } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { PositionTasks, Positions, UserPosition } from '@prisma/client'
import { PositionResponseDto } from '../../dtos/position.response.dto'
import { FindPositionRequestDto } from './find-position.request.dto'
import { FindPositionQuery } from './find-position.query-handler'

@Controller('positions')
export class FindPositionHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':positionId')
  async get(@Param() request: FindPositionRequestDto): Promise<PositionResponseDto> {
    const command = new FindPositionQuery(request)

    const result: { position: Positions; tasks: PositionTasks[]; workers: UserPosition[] } =
      await this.queryBus.execute(command)

    const { position, tasks, workers } = result

    // id: number;
    // positionId: string;
    // positionName: string;
    // taskId: string;
    // taskName: string;
    // order: number;
    // autoAssignmentType: string;

    return {
      id: position.id,
      name: position.name,
      maxAssignedTasksLimit: position.maxAssignedTasksLimit,
      description: position.description,
      tasks: tasks.map((task) => {
        return {
          taskId: task.taskId,
          taskName: task.taskName,
          autoAssignmentType: task.autoAssignmentType,
        }
      }),
      workers: workers.map((worker) => {
        return {
          userId: worker.userId,
          userName: worker.userName,
          email: worker.user_email,
        }
      }),
    }
  }
}
