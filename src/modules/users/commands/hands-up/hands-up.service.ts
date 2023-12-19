import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { HandsUpCommand } from './hands-up.command'

@CommandHandler(HandsUpCommand)
export class HandsUpService implements ICommandHandler {
  execute(command: HandsUpCommand): Promise<void> {
    return Promise.resolve()
  }
}
