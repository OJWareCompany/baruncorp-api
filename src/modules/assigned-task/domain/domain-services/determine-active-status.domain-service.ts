import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../database/prisma.service'
import { AssignedTaskEntity } from '../assigned-task.entity'
import { AssignedTaskStatusEnum } from '../assigned-task.type'

@Injectable()
export class DetermineActiveStatusDomainService {
  constructor(private readonly prismaService: PrismaService) {}
  async isActive(assignedTask: AssignedTaskEntity) {
    /**
     * Job의 assigned tasks 중에서 해당 태스크의 pre-task가
     * 모두 In Progress, Not Started가 아니라면 활성화 된다.
     */
    const preTasks = await this.prismaService.prerequisiteTasks.findMany({
      where: {
        taskId: assignedTask.taskId,
      },
    })

    const elseAssignedTasks = await this.prismaService.assignedTasks.findMany({
      where: { jobId: assignedTask.getProps().jobId },
    })
    const preTaskIds = preTasks.map((pre) => pre.prerequisiteTaskId)
    const preAssignedTasks = elseAssignedTasks.filter((eat) => preTaskIds.includes(eat.taskId))

    const hasPendingPreAssignedTask = preAssignedTasks.some(
      (pre) => pre.status === AssignedTaskStatusEnum.In_Progress || pre.status === AssignedTaskStatusEnum.Not_Started,
    )

    return !hasPendingPreAssignedTask
  }
}
