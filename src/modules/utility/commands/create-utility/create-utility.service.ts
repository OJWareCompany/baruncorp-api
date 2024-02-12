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
    // UtilityEntity.create({})를 하는 경우 props에 담을 필드가 없어서 에러가 발생한다.
    // Utility 테이블과 Entity가 추가적으로 확장되기 전까지는 Entity를 생성하지 않도록 한다.
    const utilityId: string = v4()

    const snapshotEntity: UtilitySnapshotEntity = UtilitySnapshotEntity.create({
      utilityId: utilityId,
      updatedBy: command.updatedBy,
      name: command.name,
      stateAbbreviations: command.stateAbbreviations,
      notes: command.notes,
      type: UtilitySnapshotTypeEnum.Create,
    })

    await this.utilityRepository.insert(utilityId)
    await this.utilityRepository.insertSnapshot(snapshotEntity)
    return utilityId
  }
}
