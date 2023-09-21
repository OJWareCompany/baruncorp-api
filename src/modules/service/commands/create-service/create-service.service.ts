import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { CreateServiceCommand } from './create-service.command'

@CommandHandler(CreateServiceCommand)
export class CreateServiceCommandHandler implements ICommandHandler {
  execute(command: CreateServiceCommand): Promise<any> {
    throw new Error('Method not implemented.')
  }
}
