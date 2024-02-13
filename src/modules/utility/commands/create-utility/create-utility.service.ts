/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'
import { AggregateID } from '@src/libs/ddd/entity.base'
import { CreateUtilityCommand } from './create-utility.command'
import { UtilityRepositoryPort } from '../../database/utility.repository.port'
import { UtilitySnapshotEntity } from '../../domain/utility-snapshot.entity'
import { UtilitySnapshotTypeEnum } from '@modules/utility/domain/utility-snapshot.type'
import { StateNotFoundException } from '@modules/license/domain/license.error'
import { PrismaService } from '@modules/database/prisma.service'
import { UTILITY_REPOSITORY } from '@modules/utility/utility.di-token'
import { v4 } from 'uuid'
import { UtilityEntity } from '@modules/utility/domain/utility.entity'

@CommandHandler(CreateUtilityCommand)
export class CreateUtilityService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(UTILITY_REPOSITORY) private readonly utilityRepository: UtilityRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}
  async execute(command: CreateUtilityCommand): Promise<AggregateID> {
    const statesFound = await this.prismaService.states.findMany({
      where: {
        abbreviation: {
          in: command.stateAbbreviations,
        },
      },
    })

    if (statesFound.length !== command.stateAbbreviations.length) {
      throw new StateNotFoundException()
    }

    const entity: UtilityEntity = UtilityEntity.create({
      name: command.name,
      stateAbbreviations: command.stateAbbreviations,
      notes: command.notes ?? '',
    })

    entity.checkValidation()

    const snapshotEntity: UtilitySnapshotEntity = UtilitySnapshotEntity.create({
      utilityId: entity.id,
      updatedBy: command.updatedBy,
      name: command.name,
      stateAbbreviations: command.stateAbbreviations,
      notes: command.notes ?? '',
      type: UtilitySnapshotTypeEnum.Create,
    })

    await this.utilityRepository.insert(entity)
    await this.utilityRepository.insertSnapshot(snapshotEntity)
    return entity.id
  }
}
