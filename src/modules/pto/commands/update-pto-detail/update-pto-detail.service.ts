import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PaidPTOException, PtoNotFoundException } from '../../domain/pto.error'
import { UpdatePtoDetailCommand } from './update-pto-detail.command'
import { PtoRepository } from '../../database/pto.repository'
import { PtoEntity } from '../../domain/pto.entity'
import { PtoDetailEntity } from '../../domain/pto-detail.entity'

@CommandHandler(UpdatePtoDetailCommand)
export class UpdatePtoDetailService implements ICommandHandler {
  constructor(private readonly ptoRepository: PtoRepository) {}
  async execute(command: UpdatePtoDetailCommand): Promise<void> {
    const entity: PtoDetailEntity | null = await this.ptoRepository.findOnePtoDetail(command.ptoDetailId)
    if (!entity) throw new PtoNotFoundException()

    if (entity.getProps().isPaid) throw new PaidPTOException()

    const props = entity.getProps()

    if (command.startedAt) props.startedAt = command.startedAt
    if (command.days) props.days = command.days
    if (command.ptoTypeId) props.ptoTypeId = command.ptoTypeId
    if (command.amount) props.amount = command.amount

    await this.ptoRepository.updateDetail(entity)
  }
}
