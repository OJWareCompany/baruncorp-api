import { Controller, Get, Param } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { Tasks } from '@prisma/client'
import { TaskResponseDto } from '../../dtos/task.response.dto'
import { FindTaskRequestDto } from './find-task.request.dto'
import { FindTaskQuery } from './find-task.query-handler'
import { AutoAssignmentTypeEnum } from '../../../position/domain/position.type'
import { LicenseTypeEnum } from '../../../license/dtos/license.response.dto'

@Controller('tasks')
export class FindTaskHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':taskId')
  async get(@Param() request: FindTaskRequestDto): Promise<TaskResponseDto> {
    const command = new FindTaskQuery(request)

    const result: Tasks = await this.queryBus.execute(command)

    return new TaskResponseDto({
      id: result.id,
      name: result.name,
      serviceId: result.serviceId,
      serviceName: 'PV Designe',
      licenseRequired: LicenseTypeEnum.structural,
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
  }
}
