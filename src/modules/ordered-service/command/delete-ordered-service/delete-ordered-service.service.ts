import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { PrismaService } from '../../../database/prisma.service'
import { DeleteOrderedServiceCommand } from './delete-ordered-service.command'

@CommandHandler(DeleteOrderedServiceCommand)
export class DeleteOrderedServiceService implements ICommandHandler {
  constructor(private readonly prismaService: PrismaService) {}
  async execute(command: DeleteOrderedServiceCommand): Promise<AggregateID> {
    // const entity = Entity.create()
    return ''
  }
}
