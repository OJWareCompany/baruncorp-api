/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PrismaService } from '../../../database/prisma.service'
import { PositionRepositoryPort } from '../../database/position.repository.port'
import { PositionNotFoundException } from '../../domain/position.error'
import { POSITION_REPOSITORY } from '../../position.di-token'
import { DeletePositionWorkerCommand } from './delete-position-worker.command'
import { UserRepositoryPort } from '../../../users/database/user.repository.port'
import { USER_REPOSITORY } from '../../../users/user.di-tokens'

@CommandHandler(DeletePositionWorkerCommand)
export class DeletePositionWorkerService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(POSITION_REPOSITORY)
    private readonly positionRepo: PositionRepositoryPort,
    // @ts-ignore
    @Inject(USER_REPOSITORY)
    private readonly userRepo: UserRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}
  async execute(command: DeletePositionWorkerCommand): Promise<void> {
    const entity = await this.positionRepo.findOne(command.positionId)
    if (!entity) throw new PositionNotFoundException()

    const user = await this.userRepo.findOneByIdOrThrow(command.userId)

    const userPosition = await this.prismaService.userPosition.findFirst({ where: { userId: command.userId } })
    if (userPosition) {
      await this.prismaService.userPosition.delete({
        where: { userId: user.id },
      })
    }
  }
}
