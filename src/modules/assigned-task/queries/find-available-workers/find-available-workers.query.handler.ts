/* eslint-disable @typescript-eslint/ban-ts-comment */
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { PrismaService } from '../../../database/prisma.service'
import { AssignedTaskNotFoundException } from '../../domain/assigned-task.error'
import { TaskNotFoundException } from '../../../task/domain/task.error'
import { UserPosition, Users } from '@prisma/client'
import { ProjectNotFoundException } from '../../../project/domain/project.error'
import { StateNotFoundException } from '../../../license/domain/license.error'
import { Inject } from '@nestjs/common'
import { USER_REPOSITORY } from '../../../users/user.di-tokens'
import { UserRepositoryPort } from '../../../users/database/user.repository.port'

export class FindAvailableWorkersQuery {
  readonly assignedTaskId: string
  constructor(props: FindAvailableWorkersQuery) {
    this.assignedTaskId = props.assignedTaskId
  }
}

@QueryHandler(FindAvailableWorkersQuery)
export class FindAvailableWorkersQueryHandler implements IQueryHandler {
  constructor(
    // @ts-ignore
    @Inject(USER_REPOSITORY)
    private readonly userRepo: UserRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}
  async execute(query: FindAvailableWorkersQuery): Promise<(Users & { userPosition: UserPosition | null })[]> {
    const assignedTask = await this.prismaService.assignedTasks.findUnique({ where: { id: query.assignedTaskId } })
    if (!assignedTask) throw new AssignedTaskNotFoundException()
    const task = await this.prismaService.tasks.findUnique({ where: { id: assignedTask.taskId } })
    if (!task) throw new TaskNotFoundException()
    const project = await this.prismaService.orderedProjects.findUnique({ where: { id: assignedTask.projectId } })
    if (!project) throw new ProjectNotFoundException()

    const state = await this.prismaService.states.findFirst({ where: { geoId: project.stateId } })
    if (!state) throw new StateNotFoundException()

    if (task.license_type) {
      const userLicenses = await this.prismaService.userLicense.findMany({
        where: {
          type: task.license_type,
          abbreviation: state.abbreviation,
        },
      })

      const users: (Users & { userPosition: UserPosition | null })[] = await this.prismaService.users.findMany({
        where: { id: { in: userLicenses.map((ul) => ul.userId) } },
        include: { userPosition: true },
      })
      return users
    } else {
      const availableTasks = await this.prismaService.userAvailableTasks.findMany({
        where: { taskId: task.id },
      })

      const users: (Users & { userPosition: UserPosition | null })[] = await this.prismaService.users.findMany({
        where: { id: { in: availableTasks.map((at) => at.userId) } },
        include: { userPosition: true },
      })
      return users
    }
  }
}
