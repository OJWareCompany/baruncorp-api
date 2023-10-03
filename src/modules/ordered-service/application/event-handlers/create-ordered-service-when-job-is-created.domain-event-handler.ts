/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { PrismaService } from '../../../database/prisma.service'
import { JobCreatedDomainEvent } from '../../../ordered-job/domain/events/job-created.domain-event'
import { ORDERED_SERVICE_REPOSITORY } from '../../ordered-service.di-token'
import { OrderedServiceRepositoryPort } from '../../database/ordered-service.repository.port'
import { OrderedServiceEntity } from '../../domain/ordered-service.entity'
import { ServiceNotFoundException } from '../../../service/domain/service.error'

@Injectable()
export class CreateOrderedServiceWhenJobIsCreatedEventHandler {
  constructor(
    // @ts-ignore
    @Inject(ORDERED_SERVICE_REPOSITORY) private readonly orderedServiceRepo: OrderedServiceRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}

  /**
   * 주문 품목을 저장한다.
   */
  @OnEvent(JobCreatedDomainEvent.name, { async: true, promisify: true })
  async handle(event: JobCreatedDomainEvent) {
    const orderedServiceEntities = await Promise.all(
      event.services.map(async (orderedService) => {
        let basePrice = null
        if (event.projectType === 'Residential') {
          const service = await this.prismaService.service.findUnique({ where: { id: orderedService.serviceId } })
          if (!service) throw new ServiceNotFoundException()
          basePrice = Number(service.basePrice)
        }
        return OrderedServiceEntity.create({
          price: basePrice,
          serviceId: orderedService.serviceId,
          description: orderedService.description,
          jobId: event.aggregateId,
        })
      }),
    )
    await this.orderedServiceRepo.insert(orderedServiceEntities)
  }
}
