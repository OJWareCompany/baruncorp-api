/* eslint-disable @typescript-eslint/ban-ts-comment */
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { UserPosition, Users } from '@prisma/client'
import { Inject } from '@nestjs/common'
import { ExpensePricingRepositoryPort } from '../../../expense-pricing/database/expense-pricing.repository.port'
import { EXPENSE_PRICING_REPOSITORY } from '../../../expense-pricing/expense-pricing.di-token'
import { ProjectNotFoundException } from '../../../project/domain/project.error'
import { StateNotFoundException } from '../../../license/domain/license.error'
import { TaskNotFoundException } from '../../../task/domain/task.error'
import { UserRepositoryPort } from '../../../users/database/user.repository.port'
import { USER_REPOSITORY } from '../../../users/user.di-tokens'
import { PrismaService } from '../../../database/prisma.service'
import { AssignedTaskNotFoundException } from '../../domain/assigned-task.error'
import { UserStatusEnum } from '../../../users/domain/user.types'

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
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryPort, // @ts-ignore
    @Inject(EXPENSE_PRICING_REPOSITORY) private readonly expensePricingRepo: ExpensePricingRepositoryPort,
    private readonly prisma: PrismaService,
  ) {}
  async execute(query: FindAvailableWorkersQuery): Promise<(Users & { userPosition: UserPosition | null })[]> {
    const assignedTask = await this.prisma.assignedTasks.findUnique({ where: { id: query.assignedTaskId } })
    if (!assignedTask) throw new AssignedTaskNotFoundException()
    const task = await this.prisma.tasks.findUnique({ where: { id: assignedTask.taskId } })
    if (!task) throw new TaskNotFoundException()
    const project = await this.prisma.orderedProjects.findUnique({ where: { id: assignedTask.projectId } })
    if (!project) throw new ProjectNotFoundException()

    const state = await this.prisma.states.findFirst({ where: { geoId: project.stateId } })
    if (!state) throw new StateNotFoundException()

    const expensePricings = await this.prisma.expensePricings.findMany({
      where: { taskId: task.id },
    })
    const expenseSet = new Set(expensePricings.map((expense) => expense.organizationId))

    if (task.license_type) {
      const userLicenses = await this.prisma.userLicense.findMany({
        where: {
          type: task.license_type,
          abbreviation: state.abbreviation,
        },
      })

      const users: (Users & { userPosition: UserPosition | null })[] = await this.prisma.users.findMany({
        where: { id: { in: userLicenses.map((ul) => ul.userId) }, status: UserStatusEnum.ACTIVE },
        include: { userPosition: true },
      })

      return users.filter((user) => !user.isVendor || (user.isVendor && expenseSet.has(user.organizationId)))
    } else {
      const availableTasks = await this.prisma.userAvailableTasks.findMany({
        where: { taskId: task.id },
      })

      const users: (Users & { userPosition: UserPosition | null })[] = await this.prisma.users.findMany({
        where: { id: { in: availableTasks.map((at) => at.userId) }, status: UserStatusEnum.ACTIVE },
        include: { userPosition: true },
      })

      return users.filter((user) => !user.isVendor || (user.isVendor && expenseSet.has(user.organizationId)))
    }
  }
}
