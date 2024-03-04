import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'
import { UserRepositoryPort } from '../../../users/database/user.repository.port'
import { USER_REPOSITORY } from '../../../users/user.di-tokens'
import { RemoveUserCommand } from './remove-user.command'
/* eslint-disable @typescript-eslint/ban-ts-comment */
@CommandHandler(RemoveUserCommand)
export class RemoveUserService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryPort,
  ) {}
  async execute(command: RemoveUserCommand): Promise<any> {
    const user = await this.userRepo.findOneByIdOrThrow(command.userId)
    user.removeDepartment()
    await this.userRepo.update(user)
  }
}
