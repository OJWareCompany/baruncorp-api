/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PrismaService } from '../../../database/prisma.service'
import { TaskRepositoryPort } from '../../database/task.repository.port'
import { TaskNotFoundException } from '../../domain/task.error'
import { TASK_REPOSITORY } from '../../task.di-token'
import { UpdateTaskCommand } from './update-task.command'

@CommandHandler(UpdateTaskCommand)
export class UpdateTaskService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(TASK_REPOSITORY)
    private readonly taskRepo: TaskRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}
  async execute(command: UpdateTaskCommand): Promise<void> {
    const entity = await this.taskRepo.findOne(command.taskId)
    if (!entity) throw new TaskNotFoundException()
    entity.setName(command.name)
    entity.setLicenseRequired(command.licenseType)
    await this.taskRepo.update(entity)
  }
}
