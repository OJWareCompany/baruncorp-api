/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'
import { UpdateUtilityCommand } from './update-utility.command'
import { UTILITY_REPOSITORY } from '@modules/utility/utility.di-token'
import { UtilityRepositoryPort } from '@modules/utility/database/utility.repository.port'
import { PrismaService } from '@modules/database/prisma.service'
import { StateNotFoundException } from '@modules/license/domain/license.error'
import { UtilitySnapshotEntity } from '@modules/utility/domain/utility-snapshot.entity'
import { UtilitySnapshotTypeEnum } from '@modules/utility/domain/utility-snapshot.type'
import { UtilityNotFoundException } from '@modules/utility/domain/utilty.error'

@CommandHandler(UpdateUtilityCommand)
export class UpdateUtilityService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(UTILITY_REPOSITORY) private readonly utilityRepository: UtilityRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}
  async execute(command: UpdateUtilityCommand): Promise<void> {
    const statesFound = await this.prismaService.states.findMany({
      where: {
        abbreviation: {
          in: command.stateAbbreviations,
        },
      },
    })

    if (command.stateAbbreviations) {
      if (statesFound.length !== command.stateAbbreviations.length) {
        throw new StateNotFoundException()
      }
    }

    const latestSnapshot = await this.prismaService.utilitySnapshots.findFirst({
      where: {
        utilityId: command.utilityId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    if (!latestSnapshot) {
      throw new UtilityNotFoundException()
    }

    const historyEntitiy: UtilitySnapshotEntity = UtilitySnapshotEntity.create({
      utilityId: command.utilityId,
      updatedBy: command.updatedBy,
      name: command.name ? command.name : latestSnapshot.name,
      stateAbbreviations: command.stateAbbreviations
        ? command.stateAbbreviations
        : latestSnapshot.stateAbbreviations.split(','),
      notes: command.notes ? command.notes : latestSnapshot.notes,
      type: UtilitySnapshotTypeEnum.Modify,
    })
    await this.utilityRepository.insertSnapshot(historyEntitiy)
  }
}
