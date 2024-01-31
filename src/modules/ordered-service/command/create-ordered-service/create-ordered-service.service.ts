/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { OrderModificationValidator } from '../../../ordered-job/domain/domain-services/order-modification-validator.domain-service'
import { ProjectRepositoryPort } from '../../../project/database/project.repository.port'
import { ServiceRepositoryPort } from '../../../service/database/service.repository.port'
import { PROJECT_REPOSITORY } from '../../../project/project.di-token'
import { UserRepositoryPort } from '../../../users/database/user.repository.port'
import { SERVICE_REPOSITORY } from '../../../service/service.di-token'
import { JobRepositoryPort } from '../../../ordered-job/database/job.repository.port'
import { MountingTypeEnum } from '../../../project/domain/project.type'
import { USER_REPOSITORY } from '../../../users/user.di-tokens'
import { JOB_REPOSITORY } from '../../../ordered-job/job.di-token'
import { RevisionTypeUpdateValidationDomainService } from '../../domain/domain-services/revision-type-update-validation.domain-service'
import { OrderedServiceRepositoryPort } from '../../database/ordered-service.repository.port'
import { ORDERED_SERVICE_REPOSITORY } from '../../ordered-service.di-token'
import { ServiceInitialPriceManager } from '../../domain/ordered-service-manager.domain-service'
import { OrderedServiceEntity } from '../../domain/ordered-service.entity'
import { CreateOrderedServiceCommand } from './create-ordered-service.command'

@CommandHandler(CreateOrderedServiceCommand)
export class CreateOrderedServiceService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(SERVICE_REPOSITORY) private readonly serviceRepo: ServiceRepositoryPort,
    // @ts-ignore
    @Inject(ORDERED_SERVICE_REPOSITORY) private readonly orderedServiceRepo: OrderedServiceRepositoryPort,
    // @ts-ignore
    @Inject(PROJECT_REPOSITORY) private readonly projectRepo: ProjectRepositoryPort,
    // @ts-ignore
    @Inject(JOB_REPOSITORY) private readonly jobRepo: JobRepositoryPort,
    // @ts-ignore
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryPort,
    private readonly serviceInitialPriceManager: ServiceInitialPriceManager,
    private readonly orderModificationValidator: OrderModificationValidator,
    private readonly revisionTypeUpdateValidator: RevisionTypeUpdateValidationDomainService,
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
    const service = await this.serviceRepo.findOneOrThrow(command.serviceId)
    const job = await this.jobRepo.findJobOrThrow(command.jobId)
    const project = await this.projectRepo.findOneOrThrow({ id: job.projectId })
    const editor = await this.userRepo.findOneByIdOrThrow(command.editorUserId)

    // 새로운 스코프가 주문되기 전이라 자신이 포함되지 않음
    const previouslyOrderedServices = await this.orderedServiceRepo.getPreviouslyOrderedServices(
      job.projectId,
      command.serviceId,
    )

    const orderedServiceEntity = await OrderedServiceEntity.create(
      {
        projectId: job.projectId,
        jobId: command.jobId,
        isRevision: !!previouslyOrderedServices.length,
        serviceId: command.serviceId,
        serviceName: service.name,
        description: command.description,
        projectPropertyType: job.projectPropertyType,
        mountingType: job.mountingType as MountingTypeEnum,
        organizationId: job.organizationId,
        organizationName: job.organizationName,
        projectNumber: project.projectNumber,
        projectPropertyOwnerName: project.projectPropertyOwnerName,
        jobName: job.jobName,
        isExpedited: job.getProps().isExpedited,
        updatedBy: editor.userName.fullName,
        editorUserId: editor.id,
      },
      this.serviceInitialPriceManager,
      this.orderModificationValidator,
      this.revisionTypeUpdateValidator,
    )

    await this.orderedServiceRepo.insert(orderedServiceEntity)
    return orderedServiceEntity.id
  }
}
