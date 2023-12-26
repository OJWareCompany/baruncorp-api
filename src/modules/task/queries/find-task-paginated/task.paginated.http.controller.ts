import { Controller, Get, Body, Query } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { PositionTasks, Tasks, prerequisiteTasks } from '@prisma/client'
import { TaskResponseDto } from '../../dtos/task.response.dto'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { TaskPaginatedResponseDto } from '../../dtos/task.paginated.response.dto'
// import { FindTaskPaginatedRequestDto } from './task.paginated.request.dto'
import { FindTaskPaginatedQuery } from './task.paginated.query-handler'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { AutoAssignmentTypeEnum } from '../../../position/domain/position.type'
import { LicenseTypeEnum } from '../../../license/dtos/license.response.dto'

@Controller('tasks')
export class FindTaskPaginatedHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('')
  async get(
    // @Body() request: FindTaskPaginatedRequestDto,
    @Query() queryParams: PaginatedQueryRequestDto,
  ): Promise<TaskPaginatedResponseDto> {
    const command = new FindTaskPaginatedQuery({
      ...queryParams,
      // ...request,
    })

    const result: Paginated<{
      task: Tasks
      positions: PositionTasks[]
      prerequisiteTasks: prerequisiteTasks[]
    }> = await this.queryBus.execute(command)

    return new TaskPaginatedResponseDto({
      ...result,
      items: result.items.map((item) => {
        return {
          id: item.task.id,
          name: item.task.name,
          serviceId: item.task.serviceId,
          serviceName: item.task.serviceName,
          licenseType: item.task.license_type as LicenseTypeEnum,
          taskPositions: item.positions.map((position) => {
            return {
              order: position.order,
              positionId: position.positionId,
              positionName: position.positionName,
              autoAssignmentType: position.autoAssignmentType as AutoAssignmentTypeEnum,
            }
          }),
          prerequisiteTask: item.prerequisiteTasks.map((pre) => {
            return {
              taskId: pre.prerequisiteTaskId,
              taskName: pre.prerequisiteTaskName,
            }
          }),
        }
      }),
    })
  }
}
