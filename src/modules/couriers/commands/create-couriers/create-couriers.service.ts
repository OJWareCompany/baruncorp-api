/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { CouriersNotFoundException } from '../../domain/couriers.error'
import { CreateCouriersCommand } from './create-couriers.command'
import { Inject } from '@nestjs/common'
import { COURIERS_REPOSITORY } from '@modules/couriers/couriers.di-token'
import { CouriersRepositoryPort } from '@modules/couriers/database/couriers.repository.port'
import { UpdatePtoTenurePolicyCommand } from '@modules/pto-tenure-policy/commands/update-pto-tenure-policy/update-pto-tenure-policy.command'
import { CouriersEntity } from '@modules/couriers/domain/couriers.entity'
import { IdResponse } from '@libs/api/id.response.dto'
import { AggregateID } from '@libs/ddd/entity.base'

@CommandHandler(CreateCouriersCommand)
export class CreateCouriersService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(COURIERS_REPOSITORY) private readonly couriersRepository: CouriersRepositoryPort,
  ) {}
  async execute(command: CreateCouriersCommand): Promise<AggregateID> {
    const entity: CouriersEntity = await CouriersEntity.create({
      name: command.name,
      urlParam: command.urlParam,
    })

    console.log(`entity : ${JSON.stringify(entity)}`)

    await this.couriersRepository.insert(entity)
    return entity.id
  }
}
