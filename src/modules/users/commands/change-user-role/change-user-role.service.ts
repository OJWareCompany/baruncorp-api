/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { ChangeUserRoleCommand } from './change-user-role.command'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { Inject } from '@nestjs/common'
import { USER_REPOSITORY } from '../../user.di-tokens'
import { UserRepositoryPort } from '../../database/user.repository.port'

@CommandHandler(ChangeUserRoleCommand)
export class ChangeUserRoleService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryPort,
  ) {}
  async execute(command: ChangeUserRoleCommand): Promise<AggregateID> {
    const user = await this.userRepo.findOneByIdOrThrow(command.userId)
    user.changeRole(command.newRole)
    await this.userRepo.update(user)
    return user.id
  }
}
