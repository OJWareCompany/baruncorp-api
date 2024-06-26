/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { ReactivateUserCommand } from './reactivate-user.command'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { UserRepositoryPort } from '../../database/user.repository.port'
import { Inject } from '@nestjs/common'
import { USER_REPOSITORY } from '../../user.di-tokens'
import { UserManager } from '../../domain/domain-services/user-manager.domain-service'

@CommandHandler(ReactivateUserCommand)
export class ReactivateUserService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryPort,
    private readonly userManager: UserManager,
  ) {}
  async execute(command: ReactivateUserCommand): Promise<AggregateID> {
    const user = await this.userRepo.findOneByIdOrThrow(command.userId)
    await user.reactivate(this.userManager)
    this.userRepo.update(user)
    return user.id
  }
}
