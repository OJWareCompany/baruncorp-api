import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PtoNotFoundException } from '../../domain/pto.error'
import { UpdatePtoCommand } from './update-pto.command'
import { PtoRepository } from '../../database/pto.repository'

@CommandHandler(UpdatePtoCommand)
export class UpdatePtoService implements ICommandHandler {
  constructor(private readonly ptoRepository: PtoRepository) {}
  async execute(command: UpdatePtoCommand): Promise<void> {
    const entity = await this.ptoRepository.findOne(command.ptoId)
    if (!entity) throw new PtoNotFoundException()

    entity.name = command.name

    await this.ptoRepository.update(entity)
  }
}
