/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { POSITION_REPOSITORY } from '../../position.di-token'
import { PositionEntity } from '../../domain/position.entity'
import { CreatePositionCommand } from './create-position.command'
import { PositionRepositoryPort } from '../../database/position.repository.port'

@CommandHandler(CreatePositionCommand)
export class CreatePositionService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(POSITION_REPOSITORY)
    private readonly positionRepo: PositionRepositoryPort,
  ) {}
  async execute(command: CreatePositionCommand): Promise<AggregateID> {
    // const entity = PositionEntity.create({
    //   ...command,
    // })
    // await this.positionRepo.insert(entity)
    // return entity.id
    return '911fe9ac-94b8-4a0e-b478-56e88f4aa7d7'
  }
}
