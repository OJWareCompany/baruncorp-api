/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InformationNotFoundException } from '../../domain/information.error'
import { UpdateInformationCommand } from './update-information.command'
import { Inject } from '@nestjs/common'
import { INFORMATION_REPOSITORY } from '../../information.di-token'
import { InformationRepositoryPort } from '../../database/information.repository.port'
import { InformationHistoryEntity } from '../../domain/information-history.entity'

@CommandHandler(UpdateInformationCommand)
export class UpdateInformationService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(INFORMATION_REPOSITORY) private readonly informationRepository: InformationRepositoryPort,
  ) {}
  async execute(command: UpdateInformationCommand): Promise<void> {
    const entity = await this.informationRepository.findOne(command.informationId)
    if (!entity) throw new InformationNotFoundException()

    entity.contents = command.contents

    await this.informationRepository.update(entity)

    const historyEntitiy: InformationHistoryEntity = InformationHistoryEntity.create({
      informationId: entity.id,
      contents: command.contents,
      updatedBy: command.updatedBy,
    })
    await this.informationRepository.insertHistory(historyEntitiy)
  }
}
