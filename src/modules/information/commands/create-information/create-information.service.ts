/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InformationNotFoundException } from '../../domain/information.error'
import { CreateInformationCommand } from './create-information.command'
import { Inject } from '@nestjs/common'
import { INFORMATION_REPOSITORY } from '../../information.di-token'
import { InformationRepositoryPort } from '../../database/information.repository.port'
import { InformationEntity } from '../../domain/information.entity'
import { AggregateID } from '@src/libs/ddd/entity.base'
import { InformationHistoryEntity } from '../../domain/information-history.entity'

@CommandHandler(CreateInformationCommand)
export class CreateInformationService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(INFORMATION_REPOSITORY) private readonly informationRepository: InformationRepositoryPort,
  ) {}
  async execute(command: CreateInformationCommand): Promise<AggregateID> {
    const entity: InformationEntity = InformationEntity.create({
      contents: command.contents,
      isActive: true,
    })

    await this.informationRepository.insert(entity)

    const historyEntitiy: InformationHistoryEntity = InformationHistoryEntity.create({
      informationId: entity.id,
      contents: command.contents,
      updatedBy: command.updatedBy,
    })
    await this.informationRepository.insertHistory(historyEntitiy)

    return entity.id
  }
}
