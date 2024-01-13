import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PtoNotFoundException } from '../../domain/pto.error'
import { UpdatePtoPayCommand } from './update-pto-pay.command'
import { PtoRepository } from '../../database/pto.repository'
import { PtoEntity } from '../../domain/pto.entity'

@CommandHandler(UpdatePtoPayCommand)
export class UpdatePtoPayService implements ICommandHandler {
  constructor(private readonly ptoRepository: PtoRepository) {}
  async execute(command: UpdatePtoPayCommand): Promise<void> {
    const entity: PtoEntity | null = await this.ptoRepository.findOne(command.ptoId)
    if (!entity) throw new PtoNotFoundException()

    entity.isPaid = command.isPaid

    await this.ptoRepository.update(entity)
  }
}
