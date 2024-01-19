/* eslint-disable @typescript-eslint/ban-ts-comment */
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { PositionTasks, Tasks, prerequisiteTasks } from '@prisma/client'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { PrismaService } from '../../../database/prisma.service'
import { TaskNotFoundException } from '../../domain/task.error'
import { Inject } from '@nestjs/common'
import { USER_REPOSITORY } from '../../../users/user.di-tokens'
import { UserRepositoryPort } from '../../../users/database/user.repository.port'
import { UserEntity } from '../../../users/domain/user.entity'

export class FindTaskQuery {
  readonly taskId: string
  constructor(props: FindTaskQuery) {
    initialize(this, props)
  }
}

@QueryHandler(FindTaskQuery)
export class FindTaskQueryHandler implements IQueryHandler {
  constructor(
    // @ts-ignore
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}

  async execute(query: FindTaskQuery): Promise<{
    task: Tasks
    positions: PositionTasks[]
    prerequisiteTasks: prerequisiteTasks[]
    workers: UserEntity[]
  }> {
    const task = await this.prismaService.tasks.findUnique({ where: { id: query.taskId } })
    if (!task) throw new TaskNotFoundException()

    const positions = await this.prismaService.positionTasks.findMany({ where: { taskId: task.id } })
    const prerequisiteTasks = await this.prismaService.prerequisiteTasks.findMany({ where: { taskId: task.id } })
    const userAvailableTasks = await this.prismaService.userAvailableTasks.findMany({ where: { taskId: task.id } })
    const users = await Promise.all(
      userAvailableTasks.map(async (task) => {
        return await this.userRepo.findOneByIdOrThrow(task.userId)
      }),
    )
    return {
      task: task,
      positions: positions,
      prerequisiteTasks: prerequisiteTasks,
      workers: users,
    }
  }
}
