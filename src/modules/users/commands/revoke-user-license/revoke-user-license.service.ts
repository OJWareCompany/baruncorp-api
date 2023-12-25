/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PrismaService } from '../../../database/prisma.service'
import { RevokeUserLicenseCommand } from './revoke-user-license.command'
import { StateNotFoundException } from '../../../license/domain/license.error'
import { USER_REPOSITORY } from '../../user.di-tokens'
import { UserRepositoryPort } from '../../database/user.repository.port'

@CommandHandler(RevokeUserLicenseCommand)
export class RevokeUserLicenseService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}
  async execute(command: RevokeUserLicenseCommand): Promise<void> {
    const state = await this.prismaService.states.findFirst({ where: { abbreviation: command.abbreviation } })
    if (!state) throw new StateNotFoundException()

    const user = await this.userRepo.findOneByIdOrThrow(command.userId)
    await this.prismaService.userLicense.delete({
      where: {
        userId_abbreviation_type: {
          userId: user.id,
          abbreviation: state.abbreviation,
          type: command.type,
        },
      },
    })
  }
}
