/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { OrderModificationValidator } from '../../../ordered-job/domain/domain-services/order-modification-validator.domain-service'
import { OrderedServiceNotFoundException } from '../../domain/ordered-service.error'
import { OrderedServiceRepositoryPort } from '../../database/ordered-service.repository.port'
import { ORDERED_SERVICE_REPOSITORY } from '../../ordered-service.di-token'
import { DeleteOrderedServiceCommand } from './delete-ordered-service.command'
import { OrderDeletionValidator } from '../../../ordered-job/domain/domain-services/order-deletion-validator.domain-service'

@CommandHandler(DeleteOrderedServiceCommand)
export class DeleteOrderedServiceService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(ORDERED_SERVICE_REPOSITORY)
    private readonly orderedServiceRepo: OrderedServiceRepositoryPort,
    private readonly modificationValidator: OrderModificationValidator,
    private readonly deletionValidator: OrderDeletionValidator,
  ) {}

  async execute(command: DeleteOrderedServiceCommand): Promise<void> {
    const orderedService = await this.orderedServiceRepo.findOne(command.orderedServiceId)
    if (!orderedService) throw new OrderedServiceNotFoundException()

    await orderedService.delete(this.modificationValidator, this.deletionValidator)

    await this.orderedServiceRepo.delete(orderedService)
  }
}
