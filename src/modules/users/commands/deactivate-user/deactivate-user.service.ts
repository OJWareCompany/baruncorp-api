/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { DeactivateUserCommand } from './deactivate-user.command'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { UserRepositoryPort } from '../../database/user.repository.port'
import { Inject } from '@nestjs/common'
import { USER_REPOSITORY } from '../../user.di-tokens'

@CommandHandler(DeactivateUserCommand)
export class DeactivateUserService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryPort,
  ) {}
  async execute(command: DeactivateUserCommand): Promise<AggregateID> {
    const user = await this.userRepo.findOneByIdOrThrow(command.userId)
    user.deactivate()
    this.userRepo.update(user)
    // Todo. IMAP Event
    return user.id
  }
}
