/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PrismaService } from '../../../database/prisma.service'
import { UpdateOrderedServiceCommand } from './update-ordered-service.command'
import { OrderedServiceRepositoryPort } from '../../database/ordered-service.repository.port'
import { ORDERED_SERVICE_REPOSITORY } from '../../ordered-service.di-token'
import { OrderedServiceNotFoundException } from '../../domain/ordered-service.error'

@CommandHandler(UpdateOrderedServiceCommand)
export class UpdateOrderedServiceService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(ORDERED_SERVICE_REPOSITORY)
    private readonly orderedServiceRepo: OrderedServiceRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}
  async execute(command: UpdateOrderedServiceCommand): Promise<void> {
    const orderedService = await this.orderedServiceRepo.findOne(command.orderedServiceId)
    if (!orderedService) throw new OrderedServiceNotFoundException()
    orderedService.setPriceOverride(command.priceOverride)
    orderedService.setDescription(command.description)
    await this.orderedServiceRepo.update(orderedService)
  }
}
