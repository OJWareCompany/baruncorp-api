/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PrismaService } from '../../../database/prisma.service'
import { AppointUserLicenseCommand } from './appoint-user-license.command'
import { USER_REPOSITORY } from '../../user.di-tokens'
import { UserRepositoryPort } from '../../database/user.repository.port'
import { StateNotFoundException } from '../../../license/domain/license.error'
import { AutoAssignmentTypeEnum } from '../../../position/domain/position.type'
import { POSITION_REPOSITORY } from '../../../position/position.di-token'
import { PositionRepositoryPort } from '../../../position/database/position.repository.port'
import { PositionNotFoundException } from '../../../position/domain/position.error'

@CommandHandler(AppointUserLicenseCommand)
export class AppointUserLicenseService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryPort,
    // @ts-ignore
    @Inject(POSITION_REPOSITORY)
    private readonly positionRepo: PositionRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}
  async execute(command: AppointUserLicenseCommand): Promise<void> {
    const state = await this.prismaService.states.findFirst({ where: { abbreviation: command.abbreviation } })
    if (!state) throw new StateNotFoundException()

    const user = await this.userRepo.findOneByIdOrThrow(command.userId)

    // 동일한 라이센스 있으면 제거
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

    // 새로운 라이센스 부여
    // TODO: 라이센스 부여 이벤트 추가해서 로직 분리하기
    await this.prismaService.userLicense.create({
      data: {
        userId: user.id,
        userName: user.userName.fullName,
        abbreviation: state.abbreviation,
        type: command.type,
        issuingCountryName: state.stateName,
        updatedAt: new Date(),
      },
    })

    /**
     * 유저 포지션 업데이트
     */
    const position = await this.prismaService.positions.findFirst({
      where: {
        license_type: command.type,
      },
    })
    if (!position) throw new PositionNotFoundException()

    const userPosition = await this.prismaService.userPosition.findFirst({ where: { userId: command.userId } })
    if (userPosition) {
      await this.prismaService.userPosition.delete({
        where: { userId: user.id },
      })
    }

    await this.prismaService.userPosition.create({
      data: {
        userId: user.id,
        positionId: position.id,
        positionName: position.name,
        userName: user.userName.fullName,
        user_email: user.getProps().email,
      },
    })

    // 유저의 수행 가능 태스크 조회 (라이센스드 태스크를 추가하기 위해서 (duplicated error 방지))
    const availableTask = await this.prismaService.userAvailableTasks.findMany({
      where: {
        userId: user.id,
      },
    })

    const licensedTasks = await this.prismaService.tasks.findMany({
      where: {
        license_type: command.type,
        id: { notIn: availableTask.map((task) => task.taskId) },
      },
    })

    await Promise.all(
      licensedTasks.map(async (pt) => {
        await this.prismaService.userAvailableTasks.create({
          data: {
            userName: user.userName.fullName,
            userId: user.id,
            taskId: pt.id,
            taskName: pt.name,
            autoAssignmentType: AutoAssignmentTypeEnum.all,
            isHandRaised: false,
            userPositionId: position.id,
          },
        })
      }),
    )
  }
}
