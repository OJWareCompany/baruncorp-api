/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PrismaService } from '../../../database/prisma.service'
import { CustomPricingRepositoryPort } from '../../database/custom-pricing.repository.port'
import { CustomPricingNotFoundException } from '../../domain/custom-pricing.error'
import { CUSTOM_PRICING_REPOSITORY } from '../../custom-pricing.di-token'
import { DeleteCustomPricingCommand } from './delete-custom-pricing.command'

@CommandHandler(DeleteCustomPricingCommand)
export class DeleteCustomPricingService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(CUSTOM_PRICING_REPOSITORY)
    private readonly customPricingRepo: CustomPricingRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}
  async execute(command: DeleteCustomPricingCommand): Promise<void> {
    const entity = await this.customPricingRepo.findOne(command.customPricingId)
    if (!entity) throw new CustomPricingNotFoundException()
    await this.customPricingRepo.delete(entity)
  }
}
