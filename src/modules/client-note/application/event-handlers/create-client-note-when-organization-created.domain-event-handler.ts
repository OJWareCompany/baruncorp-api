/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { OrganizationCreatedDomainEvent } from '../../../organization/domain/events/organization-created.domain-event'
import { CommandBus } from '@nestjs/cqrs'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { CreateClientNoteCommand } from '../../commands/create-client-note/create-client-note.command'

@Injectable()
export class CreateClientNoteWhenOrganizationCreatedEventHandler {
  constructor(private readonly commandBus: CommandBus) {} // @ts-ignore
  @OnEvent(OrganizationCreatedDomainEvent.name, { async: true, promisify: true })
  async handle(event: OrganizationCreatedDomainEvent) {
    const command = new CreateClientNoteCommand({
      organizationId: event.aggregateId,
      designNotes: '',
      electricalEngineeringNotes: '',
      structuralEngineeringNotes: '',
      updatedBy: event.userId,
    })
    const result: AggregateID = await this.commandBus.execute(command)
    return result
  }
}
