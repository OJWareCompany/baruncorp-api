/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { PtoEntity } from '../../domain/pto.entity'
import { CreatePtoCommand } from './create-pto.command'
import { PtoRepository } from '../../database/pto.repository'
import { UserNotFoundException } from '../../../users/user.error'
import { UserRepositoryPort } from '../../../users/database/user.repository.port'
import { USER_REPOSITORY } from '../../../users/user.di-tokens'

@CommandHandler(CreatePtoCommand)
export class CreatePtoService implements ICommandHandler {
  constructor(
    private readonly ptoRepository: PtoRepository,
    // @ts-ignore
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepositoryPort,
  ) {}
  async execute(command: CreatePtoCommand): Promise<AggregateID> {
    const entity: PtoEntity = PtoEntity.create({
      ...command,
      isPaid: false,
    })

    const user = await this.userRepository.findOneByIdOrThrow(command.userId)
    if (!user) throw new UserNotFoundException()

    await this.ptoRepository.insert(entity)
    return entity.id
  }
}
