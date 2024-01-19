/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PtoTenurePolicyNotFoundException } from '../../domain/pto-tenure-policy.error'
import { UpdatePtoTenurePolicyCommand } from './update-pto-tenure-policy.command'
import { Inject } from '@nestjs/common'
import { PTO_TENURE_REPOSITORY } from '../../pto-tenure-policy.di-token'
import { PtoTenurePolicyRepositoryPort } from '../../database/pto-tenure-policy.repository.port'

@CommandHandler(UpdatePtoTenurePolicyCommand)
export class UpdatePtoTenurePolicyService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(PTO_TENURE_REPOSITORY) private readonly ptoTenurePolicyRepository: PtoTenurePolicyRepositoryPort,
  ) {}
  async execute(command: UpdatePtoTenurePolicyCommand): Promise<void> {
    const entity = await this.ptoTenurePolicyRepository.findOne(command.ptoTenurePolicyId)
    if (!entity) throw new PtoTenurePolicyNotFoundException()

    if (command.total) entity.total = command.total

    await this.ptoTenurePolicyRepository.update(entity)
  }
}
