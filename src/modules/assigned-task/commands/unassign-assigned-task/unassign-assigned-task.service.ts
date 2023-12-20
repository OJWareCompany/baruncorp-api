import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { UnassignAssignedTaskCommand } from './unassign-assigned-task.command'

@CommandHandler(UnassignAssignedTaskCommand)
export class UnassignAssignedTaskService implements ICommandHandler {
  execute(command: UnassignAssignedTaskCommand): Promise<void> {
    return Promise.resolve()
  }
}
