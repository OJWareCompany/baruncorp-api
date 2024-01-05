import { Controller, Get, Param } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { PositionTasks, Tasks, prerequisiteTasks } from '@prisma/client'
import { TaskResponseDto } from '../../dtos/task.response.dto'
import { FindTaskRequestDto } from './find-task.request.dto'
import { FindTaskQuery } from './find-task.query-handler'
import { AutoAssignmentTypeEnum } from '../../../position/domain/position.type'
import { LicenseTypeEnum } from '../../../license/dtos/license.response.dto'
import { UserEntity } from '../../../users/domain/user.entity'

@Controller('tasks')
export class FindTaskHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':taskId')
  async get(@Param() request: FindTaskRequestDto): Promise<TaskResponseDto> {
    const command = new FindTaskQuery(request)

    const result: {
      task: Tasks
      positions: PositionTasks[]
      prerequisiteTasks: prerequisiteTasks[]
      workers: UserEntity[]
    } = await this.queryBus.execute(command)

    return new TaskResponseDto({
      id: result.task.id,
      name: result.task.name,
      serviceId: result.task.serviceId,
      serviceName: result.task.serviceName,
      licenseType: result.task.license_type as LicenseTypeEnum,
      taskPositions: result.positions.map((position) => {
        return {
          order: position.order,
          positionId: position.positionId,
          positionName: position.positionName,
          autoAssignmentType: position.autoAssignmentType as AutoAssignmentTypeEnum,
        }
      }),
      prerequisiteTask: result.prerequisiteTasks.map((pre) => {
        return {
          taskId: pre.prerequisiteTaskId,
          taskName: pre.prerequisiteTaskName,
        }
      }),
      taskWorker: result.workers.map((user) => {
        return {
          email: user.getProps().email,
          organizationId: user.getProps().organization.id,
          organizationName: user.getProps().organization.name,
          position: user.getProps().position?.name || null,
          userId: user.id,
          userName: user.userName.fullName,
        }
      }),
    })
  }
}
