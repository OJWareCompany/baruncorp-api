import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PaidPTOUpdateException, PtoNotFoundException } from '../../domain/pto.error'
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
    console.log(entity)
    if (entity.getProps().isPaid) throw new PaidPTOUpdateException()

    if (command.startedAt) entity.startedAt = new Date(command.startedAt)
    if (command.days) entity.days = command.days
    if (command.ptoTypeId) entity.ptoTypeId = command.ptoTypeId
    if (command.amountPerDay) entity.amount = command.amountPerDay

    console.log(entity.getProps().startedAt.toISOString())

    await this.ptoRepository.updateDetail(entity)
  }
}
