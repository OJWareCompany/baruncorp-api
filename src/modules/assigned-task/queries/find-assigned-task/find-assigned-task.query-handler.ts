import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { AssignedTasks, OrderedServices, Users } from '@prisma/client'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { PrismaService } from '../../../database/prisma.service'
import { AssignedTaskNotFoundException } from '../../domain/assigned-task.error'
import { PrerequisiteTaskVO } from '../../../ordered-job/domain/value-objects/assigned-task.value-object'

export class FindAssignedTaskQuery {
  readonly assignedTaskId: string
  constructor(props: FindAssignedTaskQuery) {
    initialize(this, props)
  }
}

@QueryHandler(FindAssignedTaskQuery)
export class FindAssignedTaskQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: FindAssignedTaskQuery): Promise<AssignedTasks & { prerequisiteTasks: PrerequisiteTaskVO[] }> {
    const result = await this.prismaService.assignedTasks.findUnique({
      where: { id: query.assignedTaskId },
    })
    if (!result) throw new AssignedTaskNotFoundException()
    const preTasks = await this.prismaService.prerequisiteTasks.findMany({ where: { taskId: result.taskId } })
    return { ...result, prerequisiteTasks: preTasks }
  }
}
