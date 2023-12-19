/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { ModifyAssignmentTypeOfAvailableTaskCommand } from './modify-assignment-type-of-available-task.commnad'
import { Inject } from '@nestjs/common'
import { USER_REPOSITORY } from '../../user.di-tokens'
import { UserRepositoryPort } from '../../database/user.repository.port'

@CommandHandler(ModifyAssignmentTypeOfAvailableTaskCommand)
export class ModifyAssignmentTypeOfAvailableTaskService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryPort,
  ) {}
  execute(command: ModifyAssignmentTypeOfAvailableTaskCommand): Promise<void> {
    return Promise.resolve()
  }
}
