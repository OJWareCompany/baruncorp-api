/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ConflictException, HttpException, Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { ServiceRepositoryPort } from '../../database/service.repository.port'
import { ServiceEntity } from '../../domain/service/service.entity'
import { SERVICE_REPOSITORY } from '../../service.di-token'
import { CreateServiceCommand } from './create-service.command'
import { Exception } from 'handlebars'
import { Prisma } from '@prisma/client'

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
        if (e.code === 'P2002' && e.meta?.target === 'name')
          throw new ConflictException('Already existed service name.')
      }
      throw e
    }
  }
}
