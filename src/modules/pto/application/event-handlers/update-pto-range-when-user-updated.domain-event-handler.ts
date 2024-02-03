/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { CommandBus } from '@nestjs/cqrs'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { UserDateOfJoiningUpdatedDomainEvent } from '../../../users/domain/events/user-date-of-joining-updated.domain-event'
import { UpdatePtoRangeCommand } from '../../commands/update-pto-range/update-pto-range.command'

@Injectable()
export class UpdatePtoRangeWhenUserUpdatedEventHandler {
  constructor(private readonly commandBus: CommandBus) {} // @ts-ignore
  @OnEvent(UserDateOfJoiningUpdatedDomainEvent.name, { async: true, promisify: true })
  async handle(event: UserDateOfJoiningUpdatedDomainEvent) {
    const command = new UpdatePtoRangeCommand({
      userId: event.aggregateId,
      dateOfJoining: event.dateOfJoining,
    })
    const result: AggregateID = await this.commandBus.execute(command)
    return result
  }
}
