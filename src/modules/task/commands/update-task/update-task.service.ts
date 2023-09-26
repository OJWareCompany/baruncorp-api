/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { PrismaService } from '../../../database/prisma.service'
import { TASK_REPOSITORY } from '../../task.di-token'
import { UpdateTaskCommand } from './update-task.command'

@CommandHandler(UpdateTaskCommand)
export class UpdateTaskService implements ICommandHandler {
  constructor(
    // @ts-ignore
    // @Inject(TASK_REPOSITORY)
    // private readonly TaskRepo: TaskRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}
  async execute(command: UpdateTaskCommand): Promise<AggregateID> {
    // const entity = Entity.create()
    return ''
  }
}
