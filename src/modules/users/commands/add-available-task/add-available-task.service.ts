/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AddAvailableTaskCommand } from './add-available-task.command'
import { Inject } from '@nestjs/common'
import { USER_REPOSITORY } from '../../user.di-tokens'
import { UserRepositoryPort } from '../../database/user.repository.port'
import { PrismaService } from '../../../database/prisma.service'
import { AvailableTaskAddNoLicenseException, TaskNotFoundException } from '../../../task/domain/task.error'

@CommandHandler(AddAvailableTaskCommand)
export class AddAvailableTaskService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}
  async execute(command: AddAvailableTaskCommand): Promise<void> {
    const user = await this.userRepo.findOneByIdOrThrow(command.userId)
    const task = await this.prismaService.tasks.findUnique({ where: { id: command.taskId } })
    if (!task) throw new TaskNotFoundException()
    if (!!task.license_type) {
      throw new AvailableTaskAddNoLicenseException()
    }

    const availableTask = await this.prismaService.userAvailableTasks.findFirst({
      where: {
        userId: user.id,
        taskId: task.id,
      },
    })

    if (availableTask) return

    await this.prismaService.userAvailableTasks.create({
      data: {
        userName: user.getProps().userName.getFullName(),
        userId: user.id,
        taskId: task.id,
        taskName: task.name,
        autoAssignmentType: command.autoAssignmentType,
        isHandRaised: false,
        userPositionId: user.getProps().position!.id,
      },
    })
  }
}
