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
    // Todo. 추후 정책 최고값보다 큰 값이 들어온다면, 해당 년차에 맞는 Total 값 넣는다.
    const entity: PtoEntity = PtoEntity.create({
      ...command,
      isPaid: false,
    })

    await this.ptoRepository.insert(entity)
    return entity.id
  }
}
