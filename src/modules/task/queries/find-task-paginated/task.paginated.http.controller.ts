import { Controller, Get, Body, Query } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { Tasks } from '@prisma/client'
import { TaskResponseDto } from '../../dtos/task.response.dto'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { TaskPaginatedResponseDto } from '../../dtos/task.paginated.response.dto'
// import { FindTaskPaginatedRequestDto } from './task.paginated.request.dto'
import { FindTaskPaginatedQuery } from './task.paginated.query-handler'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { LicenseRequiredEnum } from '../../domain/task.type'
import { AutoAssignmentTypeEnum } from '../../../position/domain/position.type'

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

    const result: Paginated<Tasks> = await this.queryBus.execute(command)

    return new TaskPaginatedResponseDto({
      ...result,
      items: result.items.map((task) => {
        return new TaskResponseDto({
          id: task.id,
          name: task.name,
          serviceId: task.serviceId,
          serviceName: 'PV Design',
          licenseRequired: LicenseRequiredEnum.structural,
          taskPositions: [
            {
              order: 1,
              positionId: 'vdscasdsazx',
              positionName: 'Sr. Designer',
              autoAssignmentType: AutoAssignmentTypeEnum.all,
            },
            {
              order: 2,
              positionId: 'vdscasdsazx',
              positionName: 'Jr. Designer',
              autoAssignmentType: AutoAssignmentTypeEnum.all,
            },
          ],
          prerequisiteTask: [{ taskId: 'asd', taskName: 'Something' }],
          taskWorker: [
            {
              email: 'asd@naver.com',
              organizationId: 'asda',
              organizationName: 'BarunCorp',
              position: 'Sr. Designer',
              userId: 'as',
              userName: 'chris k',
            },
          ],
        })
      }),
    })
  }
}
