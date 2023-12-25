/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { ModifyAssignmentTypeOfAvailableTaskCommand } from './modify-assignment-type-of-available-task.commnad'
import { Inject } from '@nestjs/common'
import { USER_REPOSITORY } from '../../user.di-tokens'
import { UserRepositoryPort } from '../../database/user.repository.port'
import { PrismaService } from '../../../database/prisma.service'
import {
  AvailableTaskDeleteNoLicenseException,
  AvailableTaskNotFoundException,
  TaskNotFoundException,
} from '../../../task/domain/task.error'

@CommandHandler(ModifyAssignmentTypeOfAvailableTaskCommand)
export class ModifyAssignmentTypeOfAvailableTaskService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}
  async execute(command: ModifyAssignmentTypeOfAvailableTaskCommand): Promise<void> {
    const user = await this.userRepo.findOneByIdOrThrow(command.userId)
    const task = await this.prismaService.tasks.findUnique({ where: { id: command.taskId } })
    if (!task) throw new TaskNotFoundException()
    // if (!!task.license_type) {
    //   throw new AvailableTaskDeleteNoLicenseException()
    // }

    const availableTask = await this.prismaService.userAvailableTasks.findFirst({
      where: {
        userId: user.id,
        taskId: task.id,
      },
    })
    if (!availableTask) throw new AvailableTaskNotFoundException()

    await this.prismaService.userAvailableTasks.update({
      where: {
        id: availableTask.id,
      },
      data: {
        autoAssignmentType: command.autoAssignmentType,
      },
    })
  }
}
