/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { PtoEntity } from '../../domain/pto.entity'
import { CreatePtoCommand } from './create-pto.command'
import { PtoRepositoryPort } from '../../database/pto.repository.port'
import { UserNotFoundException } from '../../../users/user.error'
import { PTO_REPOSITORY } from '../../../pto/pto.di-token'
import { DateOfJoiningNotFoundException } from '../../domain/pto.error'
import { PtoTargetUser } from '../../domain/value-objects/target.user.vo'

@CommandHandler(CreatePtoCommand)
export class CreatePtoService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(PTO_REPOSITORY) private readonly ptoRepository: PtoRepositoryPort,
  ) {}
  async execute(command: CreatePtoCommand): Promise<AggregateID> {
    const targetUser: PtoTargetUser = await this.ptoRepository.findTargetUser(command.userId)

    if (!targetUser) {
      throw new UserNotFoundException()
    }

    const ownerUserDateOfJoining = targetUser.dateOfJoining
    if (!ownerUserDateOfJoining) throw new DateOfJoiningNotFoundException()

    const entity: PtoEntity = PtoEntity.create({
      ...command,
      isPaid: false,
      dateOfJoining: ownerUserDateOfJoining,
    })

    await this.ptoRepository.insert(entity)
    return entity.id
  }
}
