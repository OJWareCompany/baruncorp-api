/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { CustomPricingRepositoryPort } from '../../database/custom-pricing.repository.port'
import { CustomPricingNotFoundException } from '../../domain/custom-pricing.error'
import { CUSTOM_PRICING_REPOSITORY } from '../../custom-pricing.di-token'
import { DeleteCustomPricingCommand } from './delete-custom-pricing.command'
import { ServiceId } from '../../../service/domain/value-objects/service-id.value-object'

@CommandHandler(DeleteCustomPricingCommand)
export class DeleteCustomPricingService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(CUSTOM_PRICING_REPOSITORY)
    private readonly customPricingRepo: CustomPricingRepositoryPort,
  ) {}
  async execute(command: DeleteCustomPricingCommand): Promise<void> {
    const entity = await this.customPricingRepo.findOne(
      new ServiceId({ value: command.serviceId }),
      command.organizationId,
    )
    if (!entity) throw new CustomPricingNotFoundException()
    await this.customPricingRepo.delete(entity)
  }
}
