import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PtoNotFoundException } from '../../domain/pto-tenure-policy.error'
import { UpdatePtoTenurePolicyCommand } from './update-pto-tenure-policy.command'
import { PtoTenurePolicyRepository } from '../../database/pto-tenure-policy.repository'

@CommandHandler(UpdatePtoTenurePolicyCommand)
export class UpdatePtoTenurePolicyService implements ICommandHandler {
  constructor(private readonly ptoTenurePolicyRepository: PtoTenurePolicyRepository) {}
  async execute(command: UpdatePtoTenurePolicyCommand): Promise<void> {
    const entity = await this.ptoTenurePolicyRepository.findOne(command.ptoTenurePolicyId)
    if (!entity) throw new PtoNotFoundException()
    // Todo. 추후 정책 최고값보다 큰 값이 들어온다면, 에러 처리
    if (command.total) entity.total = command.total

    await this.ptoTenurePolicyRepository.update(entity)
  }
}
