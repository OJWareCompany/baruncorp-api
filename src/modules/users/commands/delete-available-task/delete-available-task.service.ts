/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { DeleteAvailableTaskCommand } from './delete-available-task.commnad'
import { Inject } from '@nestjs/common'
import { USER_REPOSITORY } from '../../user.di-tokens'
import { UserRepositoryPort } from '../../database/user.repository.port'

@CommandHandler(DeleteAvailableTaskCommand)
export class DeleteAvailableTaskService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryPort,
  ) {}
  execute(command: DeleteAvailableTaskCommand): Promise<void> {
    return Promise.resolve()
  }
}
