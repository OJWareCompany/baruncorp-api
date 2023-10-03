/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { PrismaService } from '../../../database/prisma.service'
import { OrderedServiceEntity } from '../../domain/ordered-service.entity'
import { JobNotFoundException } from '../../../ordered-job/domain/job.error'
import { ServiceNotFoundException } from '../../../service/domain/service.error'
import { ORDERED_SERVICE_REPOSITORY } from '../../ordered-service.di-token'
import { OrderedServiceRepositoryPort } from '../../database/ordered-service.repository.port'
import { CreateOrderedServiceCommand } from './create-ordered-service.command'

@CommandHandler(CreateOrderedServiceCommand)
export class CreateOrderedServiceService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(ORDERED_SERVICE_REPOSITORY)
    private readonly orderedServiceRepo: OrderedServiceRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}

  /**
   * 1. 기본가 적용
   * 2. 할인가 적용 (new service 일 때)
   * 3. 가정용은 Revision일때 Major/Minor 여부에 따라 revision base price 청구
   * 4. 상업용은 New일때 시스템 사이즈별 가격
   * 5. 상업용은 Revision일때 시간에 따라 가격 적용
   * 가격은 인보이스 청구될때 정하는걸로 하자.
   */
  async execute(command: CreateOrderedServiceCommand): Promise<AggregateID> {
    const serviceMenu = await this.prismaService.service.findUnique({ where: { id: command.serviceId } })
    if (!serviceMenu) throw new ServiceNotFoundException()
    const job = await this.prismaService.orderedJobs.findUnique({ where: { id: command.jobId } })
    if (!job) throw new JobNotFoundException()

    const preOrderedServices = await this.prismaService.orderedServices.findMany({
      where: { projectId: job.projectId, serviceId: command.serviceId },
    })

    const orderedService = OrderedServiceEntity.create({
      projectId: job.projectId,
      isRevision: !!preOrderedServices.length,
      sizeForRevision: null,
      price: Number(serviceMenu.basePrice),
      serviceId: command.serviceId,
      jobId: command.jobId,
      description: command.description,
    })

    await this.orderedServiceRepo.insert(orderedService)
    return orderedService.id
  }
}
