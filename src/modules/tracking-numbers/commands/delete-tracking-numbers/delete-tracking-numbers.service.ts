/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { DeleteTrackingNumbersCommand } from './delete-tracking-numbers.command'
import { Inject } from '@nestjs/common'
import { CouriersEntity } from '@modules/couriers/domain/couriers.entity'
import { CouriersNotFoundException } from '@modules/couriers/domain/couriers.error'
import { TRACKING_NUMBERS_REPOSITORY } from '@modules/tracking-numbers/tracking-numbers.di-token'
import { TrackingNumbersRepositoryPort } from '@modules/tracking-numbers/database/tracking-numbers.repository.port'
import { TrackingNumbersEntity } from '@modules/tracking-numbers/domain/tracking-numbers.entity'
import { TrackingNumbersNotFoundException } from '@modules/tracking-numbers/domain/tracking-numbers.error'

@CommandHandler(DeleteTrackingNumbersCommand)
export class DeleteTrackingNumbersService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(TRACKING_NUMBERS_REPOSITORY) private readonly trackingNumbersRepository: TrackingNumbersRepositoryPort,
  ) {}
  async execute(command: DeleteTrackingNumbersCommand): Promise<void> {
    const entity: TrackingNumbersEntity | null = await this.trackingNumbersRepository.findOne(command.trackingNumbersId)
    if (!entity) throw new TrackingNumbersNotFoundException()

    await this.trackingNumbersRepository.delete(entity.id)
  }
}
