/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { PtoEntity } from '../../domain/pto.entity'
import { CreatePtoCommand } from './create-pto.command'
import { PtoRepositoryPort } from '../../database/pto.repository.port'
import { UserNotFoundException } from '../../../users/user.error'
import { PTO_REPOSITORY } from '../../pto.di-token'
import { DateOfJoiningNotFoundException } from '../../domain/pto.error'
import { PtoTargetUser } from '../../domain/value-objects/target.user.vo'
import { addYears, subDays } from 'date-fns'
import { UpdatePtoRangeCommand } from '../update-pto-range/update-pto-range.command'

@CommandHandler(CreatePtoCommand)
export class CreatePtoService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(PTO_REPOSITORY) private readonly ptoRepository: PtoRepositoryPort,
    private readonly commandBus: CommandBus,
  ) {}
  async execute(command: CreatePtoCommand): Promise<AggregateID> {
    const targetUser: PtoTargetUser = await this.ptoRepository.findTargetUser(command.userId)

    if (!targetUser) {
      throw new UserNotFoundException()
    }

    const ownerUserDateOfJoining = targetUser.dateOfJoining
    if (!ownerUserDateOfJoining) throw new DateOfJoiningNotFoundException()

    const startedAt = addYears(ownerUserDateOfJoining, command.tenure - 1)
    const endedAt = subDays(addYears(startedAt, 1), 1)
    const entity: PtoEntity = PtoEntity.create({
      userId: command.userId,
      tenure: command.tenure,
      isPaid: false,
      total: command.total,
      startedAt: startedAt,
      endedAt: endedAt,
      dateOfJoining: ownerUserDateOfJoining,
    })

    await this.ptoRepository.insert(entity)

    const updatePtoRangeCommand = new UpdatePtoRangeCommand({
      userId: targetUser.id,
      dateOfJoining: targetUser.dateOfJoining,
    })
    await this.commandBus.execute(updatePtoRangeCommand)
    return entity.id
  }
}
