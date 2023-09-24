/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { UNIQUE_CONSTRAINT_FAILED } from '../../../database/error-code'
import { ServiceRepositoryPort } from '../../database/service.repository.port'
import {
  ServiceNotFoundException,
  ServiceNameConflictException,
  ServiceBillingCodeConflictException,
} from '../../domain/service.error'
import { SERVICE_REPOSITORY } from '../../service.di-token'
import { UpdateServiceCommand } from './update-service.command'

@CommandHandler(UpdateServiceCommand)
export class UpdateServiceService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(SERVICE_REPOSITORY)
    private readonly serviceRepo: ServiceRepositoryPort,
  ) {}
  async execute(command: UpdateServiceCommand): Promise<void> {
    const service = await this.serviceRepo.findOne(command.serviceId)
    if (!service) throw new ServiceNotFoundException()

    service.updateName(command.name)
    service.updateBillingCode(command.billingCode)
    service.updateBasePrice(command.basePrice)

    try {
      await this.serviceRepo.update(service)
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === UNIQUE_CONSTRAINT_FAILED) {
          if (e.meta?.target === 'name') throw new ServiceNameConflictException()
          if (e.meta?.target === 'billing_code') throw new ServiceBillingCodeConflictException()
        }
      }
      throw e
    }
  }
}
