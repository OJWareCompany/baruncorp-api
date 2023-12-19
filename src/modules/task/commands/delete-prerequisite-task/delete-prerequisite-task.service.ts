/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { DeletePrerequisiteTaskCommand } from './delete-prerequisite-task.command'
import { TaskRepositoryPort } from '../../database/task.repository.port'
import { TASK_REPOSITORY } from '../../task.di-token'
import { Inject } from '@nestjs/common'

@CommandHandler(DeletePrerequisiteTaskCommand)
export class DeletePrerequisiteTaskService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(TASK_REPOSITORY)
    private readonly taskRepo: TaskRepositoryPort,
  ) {}
  execute(command: DeletePrerequisiteTaskCommand): Promise<any> {
    return Promise.resolve('618d6167-0cff-4c0f-bbf6-ed7d6e14e2f1')
  }
}
