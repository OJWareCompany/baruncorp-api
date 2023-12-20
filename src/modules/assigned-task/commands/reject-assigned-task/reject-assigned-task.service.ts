import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { RejectAssignedTaskCommand } from './reject-assigned-task.command'

@CommandHandler(RejectAssignedTaskCommand)
export class RejectAssignedTaskService implements ICommandHandler {
  execute(command: RejectAssignedTaskCommand): Promise<void> {
    return Promise.resolve()
  }
}
