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
import { PtoEntity } from '@modules/pto/domain/pto.entity'
import { PtoNotFoundException } from '@modules/pto/domain/pto.error'
import { UtilityEntity } from '@modules/utility/domain/utility.entity'

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

    const entity: UtilityEntity | null = await this.utilityRepository.findOne(command.utilityId)
    if (!entity) throw new PtoNotFoundException()

    if (command.name) entity.name = command.name
    if (command.stateAbbreviations) entity.stateAbbreviations = command.stateAbbreviations
    if (command.notes) entity.notes = command.notes

    await this.utilityRepository.update(entity)

    const historyEntitiy: UtilitySnapshotEntity = UtilitySnapshotEntity.create({
      utilityId: command.utilityId,
      updatedBy: command.updatedBy,
      name: entity.name,
      stateAbbreviations: entity.stateAbbreviations,
      notes: entity.notes,
      type: UtilitySnapshotTypeEnum.Modify,
    })
    await this.utilityRepository.insertSnapshot(historyEntitiy)
  }
}
