/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { PtoEntity } from '../../domain/pto.entity'
import { CreatePtoCommand } from './create-pto.command'
import { PtoRepository } from '../../database/pto.repository'

@CommandHandler(CreatePtoCommand)
export class CreatePtoService implements ICommandHandler {
  constructor(private readonly ptoRepository: PtoRepository) {}
  async execute(command: CreatePtoCommand): Promise<AggregateID> {
    const entity: PtoEntity = PtoEntity.create({
      ...command,
    })
    await this.ptoRepository.insert(entity)
    return entity.id
  }
}
