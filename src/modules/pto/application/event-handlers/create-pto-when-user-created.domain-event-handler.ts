/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { PrismaService } from '../../../database/prisma.service'
import { PaymentCreatedDomainEvent } from '../../../payment/domain/events/payment-created.domain-event'

import { UserCreatedDomainEvent } from '../../../users/domain/events/user-created.domain-event'
import { CommandBus } from '@nestjs/cqrs'
import { CreatePtoCommand } from '../../commands/create-pto/create-pto.command'
import { AggregateID } from '../../../../libs/ddd/entity.base'

@Injectable()
export class CreatePtoWhenUserCreatedEventHandler {
  constructor(private readonly commandBus: CommandBus) {} // @ts-ignore
  @OnEvent([UserCreatedDomainEvent.name], { async: true, promisify: true })
  async handle(event: UserCreatedDomainEvent) {
    const command = new CreatePtoCommand(event)
    const result: AggregateID = await this.commandBus.execute(command)
  }
}
