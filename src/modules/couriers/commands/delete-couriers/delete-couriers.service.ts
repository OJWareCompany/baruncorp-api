/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { DeleteCouriersCommand } from './delete-couriers.command'
import { Inject } from '@nestjs/common'
import { CouriersRepositoryPort } from '@modules/couriers/database/couriers.repository.port'
import { COURIERS_REPOSITORY } from '@modules/couriers/couriers.di-token'
import { CouriersEntity } from '@modules/couriers/domain/couriers.entity'
import { CouriersNotFoundException } from '@modules/couriers/domain/couriers.error'

@CommandHandler(DeleteCouriersCommand)
export class DeleteCouriersService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(COURIERS_REPOSITORY) private readonly courierRepository: CouriersRepositoryPort,
  ) {}
  async execute(command: DeleteCouriersCommand): Promise<void> {
    const entity: CouriersEntity | null = await this.courierRepository.findOne(command.couriersId)
    if (!entity) throw new CouriersNotFoundException()

    await this.courierRepository.delete(entity.id)
  }
}
