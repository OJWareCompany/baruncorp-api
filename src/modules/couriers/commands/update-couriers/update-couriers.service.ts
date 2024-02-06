/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { UpdateCouriersCommand } from './update-couriers.command'
import { Inject } from '@nestjs/common'
import { CouriersRepositoryPort } from '@modules/couriers/database/couriers.repository.port'
import { COURIERS_REPOSITORY } from '@modules/couriers/couriers.di-token'
import { CouriersEntity } from '@modules/couriers/domain/couriers.entity'
import { CouriersNotFoundException } from '@modules/couriers/domain/couriers.error'

@CommandHandler(UpdateCouriersCommand)
export class UpdateCouriersService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(COURIERS_REPOSITORY) private readonly courierRepository: CouriersRepositoryPort,
  ) {}
  async execute(command: UpdateCouriersCommand): Promise<void> {
    const entity: CouriersEntity | null = await this.courierRepository.findOne(command.courierId)
    if (!entity) throw new CouriersNotFoundException()

    if (command.name) entity.name = command.name
    if (command.urlParam) entity.urlParam = command.urlParam

    await this.courierRepository.update(entity)
  }
}
