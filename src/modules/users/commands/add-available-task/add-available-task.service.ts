/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AddAvailableTaskCommand } from './add-available-task.commnad'
import { Inject } from '@nestjs/common'
import { USER_REPOSITORY } from '../../user.di-tokens'
import { UserRepositoryPort } from '../../database/user.repository.port'

@CommandHandler(AddAvailableTaskCommand)
export class AddAvailableTaskService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryPort,
  ) {}
  execute(command: AddAvailableTaskCommand): Promise<void> {
    return Promise.resolve()
  }
}
