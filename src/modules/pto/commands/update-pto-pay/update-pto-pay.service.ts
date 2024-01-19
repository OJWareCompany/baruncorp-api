/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PtoNotFoundException } from '../../domain/pto.error'
import { UpdatePtoPayCommand } from './update-pto-pay.command'
import { PtoEntity } from '../../domain/pto.entity'
import { Inject } from '@nestjs/common'
import { PTO_REPOSITORY } from '../../pto.di-token'
import { PtoRepositoryPort } from '../../database/pto.repository.port'

@CommandHandler(UpdatePtoPayCommand)
export class UpdatePtoPayService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(PTO_REPOSITORY)
    private readonly ptoRepository: PtoRepositoryPort,
  ) {}
  async execute(command: UpdatePtoPayCommand): Promise<void> {
    const entity: PtoEntity | null = await this.ptoRepository.findOne(command.ptoId)
    if (!entity) throw new PtoNotFoundException()

    entity.isPaid = command.isPaid

    await this.ptoRepository.update(entity)
  }
}
