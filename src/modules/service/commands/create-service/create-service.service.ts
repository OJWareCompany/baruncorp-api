/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Prisma } from '@prisma/client'
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { UNIQUE_CONSTRAINT_FAILED } from '../../../database/error-code'
import { ServiceRepositoryPort } from '../../database/service.repository.port'
import { ServiceEntity } from '../../domain/service.entity'
import { ServiceNameConflictException, ServiceBillingCodeConflictException } from '../../domain/service.error'
import { SERVICE_REPOSITORY } from '../../service.di-token'
import { CreateServiceCommand } from './create-service.command'

@CommandHandler(CreateServiceCommand)
export class CreateServiceService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(SERVICE_REPOSITORY)
    private readonly serviceRepo: ServiceRepositoryPort,
  ) {}
  async execute(command: CreateServiceCommand): Promise<AggregateID> {
    const service = ServiceEntity.create({
      name: command.name,
      basePrice: command.basePrice,
      billingCode: command.billingCode,
    })

    try {
      await this.serviceRepo.insert(service)
      return service.id
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
