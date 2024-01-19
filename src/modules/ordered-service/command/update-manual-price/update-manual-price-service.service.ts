/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { UpdateManualPriceCommand } from './update-manual-price.command'
import { OrderedServiceRepositoryPort } from '../../database/ordered-service.repository.port'
import { ORDERED_SERVICE_REPOSITORY } from '../../ordered-service.di-token'
import { OrderedServiceNotFoundException } from '../../domain/ordered-service.error'
import { ServiceInitialPriceManager } from '../../domain/ordered-service-manager.domain-service'
import { OrderModificationValidator } from '../../../ordered-job/domain/domain-services/order-modification-validator.domain-service'

/**
 * 나름 잘 리팩토링된 케이스
 * Application Service에서는 의존성을 제공하는 역할만 하고 주요 로직은 Domain method에 있다.
 */
@CommandHandler(UpdateManualPriceCommand)
export class UpdateManualPriceService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(ORDERED_SERVICE_REPOSITORY) private readonly orderedServiceRepo: OrderedServiceRepositoryPort, // @ts-ignore
    private readonly serviceInitialPriceManager: ServiceInitialPriceManager,
    private readonly orderModificationValidator: OrderModificationValidator,
  ) {}
  async execute(command: UpdateManualPriceCommand): Promise<void> {
    const orderedService = await this.orderedServiceRepo.findOne(command.orderedServiceId)
    if (!orderedService) throw new OrderedServiceNotFoundException()

    await orderedService.setManualPrice(this.serviceInitialPriceManager, this.orderModificationValidator, command.price)

    await this.orderedServiceRepo.update(orderedService)
  }
}
