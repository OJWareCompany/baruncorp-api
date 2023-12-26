/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PrismaService } from '../../../database/prisma.service'
import { RevokeUserLicenseCommand } from './revoke-user-license.command'
import { StateNotFoundException } from '../../../license/domain/license.error'
import { USER_REPOSITORY } from '../../user.di-tokens'
import { UserRepositoryPort } from '../../database/user.repository.port'
import { UserLicenseNotFoundException } from '../../domain/user.error'
import { LicenseTypeEnum } from '../../../license/dtos/license.response.dto'
import { PositionNotFoundException } from '../../../position/domain/position.error'

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
    const isExisted = user
      .getProps()
      .licenses.find((license) => license.abbreviation === command.abbreviation && license.type === command.type)

    if (!isExisted) {
      throw new UserLicenseNotFoundException()
    }

    user.revokeLicense({ abbreviation: command.abbreviation, type: command.type })
    /**
     * Entity method로 라이센스 제거 기능을 구현하지 않으면, repo에서만 지우고 엔티티에서도 지워진줄 알고 로직을 잘못 짜게 될 수 있다. (동기화 안됨)
     */
    await this.prismaService.userLicense.delete({
      where: {
        userId_abbreviation_type: {
          userId: user.id,
          abbreviation: state.abbreviation,
          type: command.type,
        },
      },
    })

    /**
     * 만약 같은 타입의 라이센스가 없으면, 관련 태스크와 포지션을 해지한다.
     */
    const isExistedType = user.getProps().licenses.find((license) => license.type === command.type)
    if (isExistedType) {
      return
    }

    /**
     * 유저 포지션 업데이트
     */
    const userPosition = await this.prismaService.userPosition.findFirst({ where: { userId: command.userId } })
    if (userPosition) {
      await this.prismaService.userPosition.delete({
        where: { userId: user.id },
      })
    }

    const anotherType =
      command.type === LicenseTypeEnum.structural ? LicenseTypeEnum.electrical : LicenseTypeEnum.structural
    const isAnotherType = user.getProps().licenses.find((license) => license.type === anotherType)

    if (isAnotherType) {
      const position = await this.prismaService.positions.findFirst({
        where: {
          license_type: anotherType,
        },
      })
      if (!position) throw new PositionNotFoundException()

      await this.prismaService.userPosition.create({
        data: {
          userId: user.id,
          positionId: position.id,
          positionName: position.name,
          userName: user.getProps().userName.getFullName(),
          user_email: user.getProps().email,
        },
      })
    }

    // 유저의 수행 가능 태스크 조회 (라이센스드 태스크를 제거하기 위해서)
    const availableTask = await this.prismaService.userAvailableTasks.findMany({
      where: {
        userId: user.id,
      },
    })

    const licensedTasks = await this.prismaService.tasks.findMany({
      where: {
        license_type: command.type,
        id: { in: availableTask.map((task) => task.taskId) },
      },
    })

    const deleteTask = availableTask.filter((at) => at.taskId === licensedTasks.find((lt) => lt.id === at.taskId)?.id)

    await Promise.all(
      deleteTask.map(async (at) => {
        await this.prismaService.userAvailableTasks.delete({
          where: {
            id: at.id,
          },
        })
      }),
    )
  }
}
