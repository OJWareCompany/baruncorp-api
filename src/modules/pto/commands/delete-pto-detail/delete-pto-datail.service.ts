import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PtoNotFoundException } from '../../domain/pto.error'
import { DeletePtoDetailCommand } from './delete-pto-detail.command'
import { PtoRepository } from '../../database/pto.repository'

@CommandHandler(DeletePtoDetailCommand)
export class DeletePtoService implements ICommandHandler {
  constructor(private readonly ptoRepository: PtoRepository) {}
  async execute(command: DeletePtoDetailCommand): Promise<void> {
    const entity = await this.ptoRepository.findOne(command.ptoDetailId)
    if (!entity) throw new PtoNotFoundException()
    await this.ptoRepository.delete(command.ptoDetailId)
  }
}
