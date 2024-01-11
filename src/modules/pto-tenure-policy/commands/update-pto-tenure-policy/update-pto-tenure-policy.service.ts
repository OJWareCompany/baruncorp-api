import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PtoTenurePolicyNotFoundException } from '../../domain/pto-tenure-policy.error'
import { UpdatePtoTenurePolicyCommand } from './update-pto-tenure-policy.command'
import { PtoTenurePolicyRepository } from '../../database/pto-tenure-policy.repository'

@CommandHandler(UpdatePtoTenurePolicyCommand)
export class UpdatePtoTenurePolicyService implements ICommandHandler {
  constructor(private readonly ptoTenurePolicyRepository: PtoTenurePolicyRepository) {}
  async execute(command: UpdatePtoTenurePolicyCommand): Promise<void> {
    const entity = await this.ptoTenurePolicyRepository.findOne(command.ptoTenurePolicyId)
    if (!entity) throw new PtoTenurePolicyNotFoundException()

    if (command.total) entity.total = command.total

    await this.ptoTenurePolicyRepository.update(entity)
  }
}
