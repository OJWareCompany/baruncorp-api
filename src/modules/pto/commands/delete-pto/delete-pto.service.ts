import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PtoNotFoundException } from '../../domain/pto.error'
import { DeletePtoCommand } from './delete-pto.command'
import { PtoRepository } from '../../database/pto.repository'

@CommandHandler(DeletePtoCommand)
export class DeletePtoService implements ICommandHandler {
  constructor(private readonly ptoRepository: PtoRepository) {}
  async execute(command: DeletePtoCommand): Promise<void> {
    const entity = await this.ptoRepository.findOne(command.ptoId)
    if (!entity) throw new PtoNotFoundException()
    await this.ptoRepository.delete(command.ptoId)
  }
}
