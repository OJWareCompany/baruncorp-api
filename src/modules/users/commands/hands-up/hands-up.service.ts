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
  ) {}
  async execute(command: HandsUpCommand): Promise<void> {
    const availableTasks = await this.prismaService.userAvailableTasks.findMany({ where: { userId: command.userId } })
    if (!availableTasks.length) throw new AvailableTaskNotFoundException()
    const user = await this.userRepo.findOneByIdOrThrow(command.userId)
    if (user.getProps().isHandRaisedForTask) throw new BadRequestException('already hand raised ', '77002')
    if (user.getProps().isVendor) throw new ForbiddenException('vendor can not raise a hand', '77001')

    const pendingTasks = await this.prismaService.assignedTasks.findMany({
      where: {
        is_active: true,
        status: AssignedTaskStatusEnum.Not_Started,
        taskId: { in: availableTasks.map((at) => at.taskId) },
      },
      orderBy: [{ is_expedited: 'desc' }, { created_at: 'asc' }],
    })

    for (const pendingTask of pendingTasks) {
      const task = await this.prismaService.tasks.findUnique({ where: { id: pendingTask.taskId } })
      if (!task) continue // TODO: 관리자에게 알람?
      if (task.license_type) {
        const project = await this.prismaService.orderedProjects.findUnique({ where: { id: pendingTask.projectId } })
        if (!project) continue // TODO: 관리자에게 알람?
        const state = await this.prismaService.states.findFirst({ where: { geoId: project.stateId } })
        if (!state) continue // TODO: 관리자에게 알람?

        const userLicenses = await this.prismaService.userLicense.findMany({
          where: {
            type: task.license_type,
            abbreviation: state.abbreviation,
            userId: command.userId,
          },
        })
        // 해당 라이센스가 없다면 다음 태스크 순회
        if (!userLicenses.length) continue
      }

      // 할당한다.
      const assignedTaskEntity = this.assignedTaskMapper.toDomain(pendingTask)
      assignedTaskEntity.assign(user, null) // OK?
      await this.assignedTaskRepo.update(assignedTaskEntity)
      return
    }

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
}
