/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PrismaService } from '../../../database/prisma.service'
import { PositionRepositoryPort } from '../../database/position.repository.port'
import { PositionNotFoundException, PositionTaskNotFoundException } from '../../domain/position.error'
import { POSITION_REPOSITORY } from '../../position.di-token'
import { UpdatePositionTaskAutoAssignmentTypeCommand } from './update-position-task-autoassignment-type.command'

@CommandHandler(UpdatePositionTaskAutoAssignmentTypeCommand)
export class UpdatePositionTaskAutoAssignmentTypeService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(POSITION_REPOSITORY)
    private readonly positionRepo: PositionRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}
  async execute(command: UpdatePositionTaskAutoAssignmentTypeCommand): Promise<void> {
    const entity = await this.positionRepo.findOne(command.positionId)
    if (!entity) throw new PositionNotFoundException()

    const positionTask = await this.prismaService.positionTasks.findFirst({
      where: {
        positionId: command.positionId,
        taskId: command.taskId,
      },
    })
    if (!positionTask) throw new PositionTaskNotFoundException()

    await this.prismaService.positionTasks.update({
      where: { id: positionTask.id },
      data: {
        autoAssignmentType: command.autoAssignmentType,
      },
    })
  }
}
