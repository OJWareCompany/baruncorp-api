/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { POSITION_REPOSITORY } from '../../position.di-token'
import { AddPositionWorkerCommand as AddPositionWorkerCommand } from './add-position-worker.command'
import { PositionRepositoryPort } from '../../database/position.repository.port'
import { PrismaService } from '../../../database/prisma.service'
import { PositionNotFoundException, PositionWorkerLicenseInvalidException } from '../../domain/position.error'
import { USER_REPOSITORY } from '../../../users/user.di-tokens'
import { UserRepositoryPort } from '../../../users/database/user.repository.port'

/**
 * position task를 추가할때..
 * 1. position entity를 조회한다.
 * 2. 그냥 바로 prisma service를 이용해서 insert 하고 try catch로 예외처리만 한다.
 * 3. position task vo를 인자로 받는 repository 메서드를 정의한다.
 *  - X
 *  - Repository is only for entity
 */
@CommandHandler(AddPositionWorkerCommand)
export class AddPositionWorkerService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(POSITION_REPOSITORY)
    private readonly positionRepo: PositionRepositoryPort,
    // @ts-ignore
    @Inject(USER_REPOSITORY)
    private readonly userRepo: UserRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}
  async execute(command: AddPositionWorkerCommand): Promise<void> {
    const entity = await this.positionRepo.findOne(command.positionId)
    if (!entity) throw new PositionNotFoundException()

    const user = await this.userRepo.findOneByIdOrThrow(command.userId)
    if (user.getProps().position?.id === command.positionId) return

    const licenseType = entity.getProps().licenseType
    if (!!licenseType) {
      const licenses = await this.prismaService.userLicense.findMany({ where: { userId: user.id } })
      const matchLicense = licenses.filter((license) => license.type === licenseType)
      if (!matchLicense.length) throw new PositionWorkerLicenseInvalidException(licenseType)
    }

    const userPosition = await this.prismaService.userPosition.findFirst({ where: { userId: command.userId } })
    if (userPosition) {
      await this.prismaService.userPosition.delete({
        where: { userId: user.id },
      })
    }

    await this.prismaService.userPosition.create({
      data: {
        userId: user.id,
        positionId: entity.id,
        positionName: entity.getProps().name,
        userName: user.getProps().userName.getFullName(),
        user_email: user.getProps().email,
      },
    })
  }
}
