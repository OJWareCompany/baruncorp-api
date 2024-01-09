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
    // Todo. 추후 정책 최고값보다 큰 값이 들어온다면, 에러 처리
    if (command.total) entity.total = command.total
    if (command.isPaid) entity.isPaid = command.isPaid

    await this.ptoRepository.update(entity)
  }
}
