import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { UpdateOrderedServiceCommand } from './update-ordered-service.command'

@CommandHandler(UpdateOrderedServiceCommand)
export class UpdateOrderedServiceService implements ICommandHandler {
  constructor(private readonly prismaService: PrismaService) {}
  async execute(command: UpdateOrderedServiceCommand): Promise<AggregateID> {
    const entity = Entity.create()
  }
}
