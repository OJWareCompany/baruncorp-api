/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { PrismaService } from '../../../database/prisma.service'
import { TASK_REPOSITORY } from '../../task.di-token'
import { DeleteTaskCommand } from './delete-task.command'

@CommandHandler(DeleteTaskCommand)
export class DeleteTaskService implements ICommandHandler {
  constructor(
    // @ts-ignore
    // @Inject(TASK_REPOSITORY)
    // private readonly TaskRepo: TaskRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}
  async execute(command: DeleteTaskCommand): Promise<AggregateID> {
    // const entity = Entity.create()
    return ''
  }
}
