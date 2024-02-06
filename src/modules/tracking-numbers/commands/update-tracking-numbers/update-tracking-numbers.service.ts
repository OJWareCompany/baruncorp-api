/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { UpdateTrackingNumbersCommand } from './update-tracking-numbers.command'
import { Inject } from '@nestjs/common'
import { TrackingNumbersRepositoryPort } from '@modules/tracking-numbers/database/tracking-numbers.repository.port'
import { TrackingNumbersNotFoundException } from '@modules/tracking-numbers/domain/tracking-numbers.error'
import { TrackingNumbersEntity } from '@modules/tracking-numbers/domain/tracking-numbers.entity'
import { TRACKING_NUMBERS_REPOSITORY } from '@modules/tracking-numbers/tracking-numbers.di-token'
import { CouriersEntity } from '@modules/couriers/domain/couriers.entity'
import { CouriersNotFoundException } from '@modules/couriers/domain/couriers.error'
import { CouriersRepositoryPort } from '@modules/couriers/database/couriers.repository.port'
import { COURIERS_REPOSITORY } from '@modules/couriers/couriers.di-token'

@CommandHandler(UpdateTrackingNumbersCommand)
export class UpdateTrackingNumbersService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(TRACKING_NUMBERS_REPOSITORY) private readonly trackingNumbersRepository: TrackingNumbersRepositoryPort,
    // @ts-ignore
    @Inject(COURIERS_REPOSITORY) private readonly couriersRepository: CouriersRepositoryPort,
  ) {}
  async execute(command: UpdateTrackingNumbersCommand): Promise<void> {
    const entity: TrackingNumbersEntity | null = await this.trackingNumbersRepository.findOne(command.trackingNumberId)
    if (!entity) throw new TrackingNumbersNotFoundException()

    if (command.trackingNumber) entity.trackingNumber = command.trackingNumber
    if (command.courierId) {
      const couriersEntity: CouriersEntity | null = await this.couriersRepository.findOne(command.courierId)
      if (!couriersEntity) throw new CouriersNotFoundException()

      entity.courierId = command.courierId
    }

    await this.trackingNumbersRepository.update(entity)
  }
}
