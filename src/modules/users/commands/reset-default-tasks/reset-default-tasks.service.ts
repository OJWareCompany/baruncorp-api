/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { ResetDefaultTasksCommand } from './reset-default-tasks.command'
import { Inject } from '@nestjs/common'
import { USER_REPOSITORY } from '../../user.di-tokens'
import { UserRepositoryPort } from '../../database/user.repository.port'
import { PrismaService } from '../../../database/prisma.service'
import { POSITION_REPOSITORY } from '../../../position/position.di-token'
import { PositionRepositoryPort } from '../../../position/database/position.repository.port'
import { PositionNotFoundException } from '../../../position/domain/position.error'

@CommandHandler(ResetDefaultTasksCommand)
export class ResetDefaultTasksService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryPort,
    // @ts-ignore
    @Inject(POSITION_REPOSITORY) private readonly positionRepo: PositionRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}
  async execute(command: ResetDefaultTasksCommand): Promise<void> {
    const user = await this.userRepo.findOneByIdOrThrow(command.userId)

    const userPosition = user.getProps().position
    if (!userPosition) throw new PositionNotFoundException()
    const position = await this.positionRepo.findOne(userPosition.id)
    if (!position) throw new PositionNotFoundException()

    const availableTask = await this.prismaService.userAvailableTasks.findMany({
      where: {
        userId: user.id,
      },
    })

    if (availableTask.length) {
      await this.prismaService.userAvailableTasks.deleteMany({
        where: {
          userId: user.id,
        },
      })
    }

    const positionTasks = await this.prismaService.positionTasks.findMany({
      where: {
        positionId: position.id,
      },
    })

    await Promise.all(
      positionTasks.map(async (pt) => {
        await this.prismaService.userAvailableTasks.create({
          data: {
            userName: user.getProps().userName.getFullName(),
            userId: user.id,
            taskId: pt.taskId,
            taskName: pt.taskName,
            autoAssignmentType: pt.autoAssignmentType,
            isHandRaised: false,
            userPositionId: userPosition.id,
          },
        })
      }),
    )
  }
}
