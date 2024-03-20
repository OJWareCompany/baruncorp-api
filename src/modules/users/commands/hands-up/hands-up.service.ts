/* eslint-disable @typescript-eslint/ban-ts-comment */
import { BadRequestException, ForbiddenException, Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { HandsUpCommand } from './hands-up.command'
import { PrismaService } from '../../../database/prisma.service'
import { AvailableTaskNotFoundException } from '../../../task/domain/task.error'
import { AssignedTaskStatusEnum } from '../../../assigned-task/domain/assigned-task.type'
import { AssignedTaskMapper } from '../../../assigned-task/assigned-task.mapper'
import { USER_REPOSITORY } from '../../user.di-tokens'
import { UserRepositoryPort } from '../../database/user.repository.port'
import { ASSIGNED_TASK_REPOSITORY } from '../../../assigned-task/assigned-task.di-token'
import { AssignedTaskRepositoryPort } from '../../../assigned-task/database/assigned-task.repository.port'
import { OrderModificationValidator } from '../../../ordered-job/domain/domain-services/order-modification-validator.domain-service'
import { AutoAssignmentTypeEnum } from '../../../position/domain/position.type'
import { AssignedTasks, UserAvailableTasks } from '@prisma/client'
import { UserEntity } from '../../domain/user.entity'

@CommandHandler(HandsUpCommand)
export class HandsUpService implements ICommandHandler {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly assignedTaskMapper: AssignedTaskMapper,
    // @ts-ignore
    @Inject(USER_REPOSITORY)
    private readonly userRepo: UserRepositoryPort,
    // @ts-ignore
    @Inject(ASSIGNED_TASK_REPOSITORY)
    private readonly assignedTaskRepo: AssignedTaskRepositoryPort,
    private readonly orderModificationValidator: OrderModificationValidator,
  ) {}
  async execute(command: HandsUpCommand): Promise<void> {
    const availableTasks = await this.prismaService.userAvailableTasks.findMany({
      where: { userId: command.userId, autoAssignmentType: { not: AutoAssignmentTypeEnum.none } },
    })
    if (!availableTasks.length) throw new AvailableTaskNotFoundException()
    const user = await this.userRepo.findOneByIdOrThrow(command.userId)
    if (user.getProps().isHandRaisedForTask) throw new BadRequestException('already hand raised ', '77002')
    if (user.getProps().isVendor) throw new ForbiddenException('vendor can not raise a hand', '77001')

    console.log('availableTasks:', availableTasks)
    const pendingTasks = await this.prismaService.assignedTasks.findMany({
      where: {
        is_active: true,
        status: AssignedTaskStatusEnum.Not_Started,
        taskId: { in: availableTasks.map((at) => at.taskId) },
      },
      orderBy: [{ is_expedited: 'desc' }, { created_at: 'asc' }],
    })

    console.log('pendingTasks: ', pendingTasks)
    const hasAssigned = await this.assign(user, availableTasks, pendingTasks)

    if (hasAssigned) return

    // 할당된 태스크가 없다면 손을 들고 종료
    await Promise.all(
      availableTasks.map(async (at) => {
        await this.prismaService.userAvailableTasks.update({
          where: { id: at.id },
          data: {
            isHandRaised: true,
            raisedAt: new Date(),
          },
        })
      }),
    )

    await this.prismaService.users.update({
      where: { id: command.userId },
      data: {
        isHandRaisedForTask: true,
      },
    })
  }

  async assign(
    user: UserEntity,
    availableTasks: UserAvailableTasks[],
    pendingTasks: AssignedTasks[],
  ): Promise<boolean> {
    for (const pendingTask of pendingTasks) {
      const task = await this.prismaService.tasks.findUnique({ where: { id: pendingTask.taskId } })
      if (!task) continue // TODO: 관리자에게 알람?
      const project = await this.prismaService.orderedProjects.findUnique({ where: { id: pendingTask.projectId } })
      if (!project) continue // TODO: 관리자에게 알람?

      // 자동할당 옵션 적용
      const targetTask = availableTasks.find((at) => at.taskId === pendingTask.taskId)
      const isPermittedAutoAssignmentType =
        targetTask?.autoAssignmentType === AutoAssignmentTypeEnum.all ||
        targetTask?.autoAssignmentType === pendingTask.projectPropertyType
      if (!isPermittedAutoAssignmentType) {
        continue
      }

      if (task.license_type) {
        const state = await this.prismaService.states.findFirst({ where: { geoId: project.stateId } })
        if (!state) continue // TODO: 관리자에게 알람?

        const userLicenses = await this.prismaService.userLicense.findMany({
          where: {
            type: task.license_type,
            abbreviation: state.abbreviation,
            userId: user.id,
          },
        })
        // 해당 라이센스가 없다면 다음 태스크 순회
        if (!userLicenses.length) continue
      }

      // 할당한다.
      const assignedTaskEntity = this.assignedTaskMapper.toDomain(pendingTask)
      await assignedTaskEntity.assign(user, this.orderModificationValidator) // OK?
      await this.assignedTaskRepo.update(assignedTaskEntity)
      return true
    }
    return false
  }
}
