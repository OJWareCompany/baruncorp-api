/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { PrismaService } from '../../../database/prisma.service'
import { TASK_REPOSITORY } from '../../task.di-token'
import { AddPrerequisiteTaskCommand } from './add-prerequisite-task.command'
import { TaskRepositoryPort } from '../../database/task.repository.port'
import { TaskEntity } from '../../domain/task.entity'
import { ServiceNotFoundException } from '../../../service/domain/service.error'

@CommandHandler(AddPrerequisiteTaskCommand)
export class AddPrerequisiteTaskService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(TASK_REPOSITORY)
    private readonly taskRepo: TaskRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}
  async execute(command: AddPrerequisiteTaskCommand): Promise<AggregateID> {
    return '618d6167-0cff-4c0f-bbf6-ed7d6e14e2f1'
  }
}
