/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PrismaService } from '../../../database/prisma.service'
import { PositionRepositoryPort } from '../../database/position.repository.port'
import { PositionNotFoundException } from '../../domain/position.error'
import { POSITION_REPOSITORY } from '../../position.di-token'
import { DeletePositionTaskCommand } from './delete-position-task.command'

@CommandHandler(DeletePositionTaskCommand)
export class DeletePositionTaskService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(POSITION_REPOSITORY)
    private readonly positionRepo: PositionRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}
  async execute(command: DeletePositionTaskCommand): Promise<void> {
    // const entity = await this.positionRepo.findOne(command.positionId)
    // if (!entity) throw new PositionNotFoundException()
    // await this.positionRepo.update(entity)
    return
  }
}
