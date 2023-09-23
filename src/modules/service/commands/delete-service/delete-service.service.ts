/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Prisma } from '@prisma/client'
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { UNIQUE_CONSTRAINT_FAILED } from '../../../database/error-code'
import {
  ServiceBillingCodeConflictException,
  ServiceNameConflictException,
  ServiceNotFoundException,
} from '../../domain/service/service.error'
import { ServiceRepositoryPort } from '../../database/service.repository.port'
import { SERVICE_REPOSITORY } from '../../service.di-token'
import { DeleteServiceCommand } from './delete-service.command'

@CommandHandler(DeleteServiceCommand)
export class DeleteServiceService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(SERVICE_REPOSITORY)
    private readonly serviceRepo: ServiceRepositoryPort,
  ) {}
  async execute(command: DeleteServiceCommand): Promise<void> {
    const service = await this.serviceRepo.findOne(command.serviceId)
    if (!service) throw new ServiceNotFoundException()

    try {
      await this.serviceRepo.delete(service)
    } catch (e) {
      throw e
    }
  }
}
