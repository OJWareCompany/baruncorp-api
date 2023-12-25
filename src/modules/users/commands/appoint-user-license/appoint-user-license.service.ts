/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { PrismaService } from '../../../database/prisma.service'
import { AppointUserLicenseCommand } from './appoint-user-license.command'
import { USER_REPOSITORY } from '../../user.di-tokens'
import { UserRepositoryPort } from '../../database/user.repository.port'
import { StateNotFoundException } from '../../../license/domain/license.error'

@CommandHandler(AppointUserLicenseCommand)
export class AppointUserLicenseService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}
  async execute(command: AppointUserLicenseCommand): Promise<void> {
    const state = await this.prismaService.states.findFirst({ where: { abbreviation: command.abbreviation } })
    if (!state) throw new StateNotFoundException()

    const user = await this.userRepo.findOneByIdOrThrow(command.userId)

    const userLicense = await this.prismaService.userLicense.findUnique({
      where: {
        userId_abbreviation_type: {
          userId: user.id,
          abbreviation: state.abbreviation,
          type: command.type,
        },
      },
    })

    if (userLicense) {
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
    await this.prismaService.userLicense.create({
      data: {
        userId: user.id,
        userName: user.getProps().userName.getFullName(),
        abbreviation: state.abbreviation,
        type: command.type,
        issuingCountryName: state.stateName,
        updatedAt: new Date(),
      },
    })
  }
}
