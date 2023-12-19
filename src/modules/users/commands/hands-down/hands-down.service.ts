import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { HandsDownCommand } from './hands-down.command'

@CommandHandler(HandsDownCommand)
export class HandsDownService implements ICommandHandler {
  execute(command: HandsDownCommand): Promise<void> {
    return Promise.resolve()
  }
}
