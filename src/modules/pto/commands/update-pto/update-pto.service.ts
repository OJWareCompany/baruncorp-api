import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PtoNotFoundException } from '../../domain/pto.error'
import { UpdatePtoCommand } from './update-pto.command'
import { PtoRepository } from '../../database/pto.repository'
import { PtoEntity } from '../../domain/pto.entity'

@CommandHandler(UpdatePtoCommand)
export class UpdatePtoService implements ICommandHandler {
  constructor(private readonly ptoRepository: PtoRepository) {}
  async execute(command: UpdatePtoCommand): Promise<void> {
    const entity: PtoEntity | null = await this.ptoRepository.findOne(command.ptoId)
    if (!entity) throw new PtoNotFoundException()

    const props = entity.getProps()

    // Todo. 나중에 API 분리하여 처리
    if (command.total) entity.total = command.total
    if (command.isPaid) props.isPaid = command.isPaid

    await this.ptoRepository.update(entity)
  }
}
