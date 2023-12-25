/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { POSITION_REPOSITORY } from '../../position.di-token'
import { PositionEntity } from '../../domain/position.entity'
import { CreatePositionCommand } from './create-position.command'
import { PositionRepositoryPort } from '../../database/position.repository.port'
import { PositionNameConflictException } from '../../domain/position.error'

@CommandHandler(CreatePositionCommand)
export class CreatePositionService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(POSITION_REPOSITORY)
    private readonly positionRepo: PositionRepositoryPort,
  ) {}
  async execute(command: CreatePositionCommand): Promise<AggregateID> {
    const isExisted = await this.positionRepo.findByName(command.name)
    if (isExisted) throw new PositionNameConflictException()

    const entity = PositionEntity.create({
      name: command.name,
      description: command.description,
      maxAssignedTasksLimit: command.maxAssignedTasksLimit,
    })
    await this.positionRepo.insert(entity)
    return entity.id
  }
}
