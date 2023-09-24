import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { PrismaService } from '../../../database/prisma.service'
import { CreateOrderedServiceCommand } from './create-ordered-service.command'

@CommandHandler(CreateOrderedServiceCommand)
export class CreateOrderedServiceService implements ICommandHandler {
  constructor(private readonly prismaService: PrismaService) {}
  async execute(command: CreateOrderedServiceCommand): Promise<AggregateID> {
    // const entity = Entity.create()
    return ''
  }
}
