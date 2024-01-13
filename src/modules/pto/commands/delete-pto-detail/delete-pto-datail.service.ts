import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PaidPTOException, PtoNotFoundException } from '../../domain/pto.error'
import { DeletePtoDetailCommand } from './delete-pto-detail.command'
import { PtoRepository } from '../../database/pto.repository'

@CommandHandler(DeletePtoDetailCommand)
export class DeletePtoDetailService implements ICommandHandler {
  constructor(private readonly ptoRepository: PtoRepository) {}
  async execute(command: DeletePtoDetailCommand): Promise<void> {
    const entity = await this.ptoRepository.findOnePtoDetail(command.ptoDetailId)
    if (!entity) throw new PtoNotFoundException()

    if (entity.getProps().isPaid) {
      throw new PaidPTOException()
    }

    await this.ptoRepository.delete(command.ptoDetailId)
  }
}
