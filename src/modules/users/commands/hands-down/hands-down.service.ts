import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { HandsDownCommand } from './hands-down.command'
import { PrismaService } from '../../../database/prisma.service'

@CommandHandler(HandsDownCommand)
export class HandsDownService implements ICommandHandler {
  constructor(private readonly prismaService: PrismaService) {}
  async execute(command: HandsDownCommand): Promise<void> {
    const availableTasks = await this.prismaService.userAvailableTasks.findMany({ where: { userId: command.userId } })

    await Promise.all(
      availableTasks.map(async (at) => {
        await this.prismaService.userAvailableTasks.update({
          where: { id: at.id },
          data: {
            isHandRaised: false,
            raisedAt: null,
          },
        })
      }),
    )

    await this.prismaService.users.update({
      where: { id: command.userId },
      data: {
        isHandRaisedForTask: false,
      },
    })
  }
}
