/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { PrismaService } from '../../../database/prisma.service'
import { ORDERED_SERVICE_REPOSITORY } from '../../ordered-service.di-token'
import { OrderedServiceRepositoryPort } from '../../database/ordered-service.repository.port'
import { OrderedServiceMapper } from '../../ordered-service.mapper'
import { JobCanceledDomainEvent } from '../../../ordered-job/domain/events/job-canceled.domain-event'

@Injectable()
export class CancelOrderedServiceWhenJobIsCanceledDomainEventHandler {
  constructor(
    // @ts-ignore
    @Inject(ORDERED_SERVICE_REPOSITORY) private readonly orderedServiceRepo: OrderedServiceRepositoryPort,
    private readonly prismaService: PrismaService,
    private readonly mapper: OrderedServiceMapper,
  ) {}

  /**
   * 주문 품목을 저장한다.
   */
  @OnEvent(JobCanceledDomainEvent.name, { async: true, promisify: true })
  async handle(event: JobCanceledDomainEvent) {
    const records = await this.prismaService.orderedServices.findMany({
      where: { jobId: event.aggregateId },
      include: { assignedTasks: true },
    })

    const orderedServiceEntities = records.map(this.mapper.toDomain)
    orderedServiceEntities.map((service) => service.cancel())

    await this.orderedServiceRepo.update(orderedServiceEntities)
  }
}
