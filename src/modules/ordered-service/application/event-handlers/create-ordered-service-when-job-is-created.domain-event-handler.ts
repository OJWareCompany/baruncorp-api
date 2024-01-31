/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { INTEGRATED_ORDER_MODIFICATION_HISTORY_REPOSITORY } from '../../../integrated-order-modification-history/integrated-order-modification-history.di-token'
import { IntegratedOrderModificationHistoryRepositoryPort } from '../../../integrated-order-modification-history/database/integrated-order-modification-history.repository.port'
import { MountingTypeEnum, ProjectPropertyTypeEnum } from '../../../project/domain/project.type'
import { OrderModificationValidator } from '../../../ordered-job/domain/domain-services/order-modification-validator.domain-service'
import { JobCreatedDomainEvent } from '../../../ordered-job/domain/events/job-created.domain-event'
import { ProjectRepositoryPort } from '../../../project/database/project.repository.port'
import { UserRepositoryPort } from '../../../users/database/user.repository.port'
import { JobRepositoryPort } from '../../../ordered-job/database/job.repository.port'
import { PROJECT_REPOSITORY } from '../../../project/project.di-token'
import { USER_REPOSITORY } from '../../../users/user.di-tokens'
import { JOB_REPOSITORY } from '../../../ordered-job/job.di-token'
import { RevisionTypeUpdateValidationDomainService } from '../../domain/domain-services/revision-type-update-validation.domain-service'
import { OrderedServiceRepositoryPort } from '../../database/ordered-service.repository.port'
import { ORDERED_SERVICE_REPOSITORY } from '../../ordered-service.di-token'
import { ServiceInitialPriceManager } from '../../domain/ordered-service-manager.domain-service'
import { OrderedServiceEntity } from '../../domain/ordered-service.entity'

@Injectable()
export class CreateOrderedServiceWhenJobIsCreatedEventHandler {
  constructor(
    // @ts-ignore
    @Inject(PROJECT_REPOSITORY) private readonly projectRepo: ProjectRepositoryPort,
    // @ts-ignore
    @Inject(ORDERED_SERVICE_REPOSITORY) private readonly orderedServiceRepo: OrderedServiceRepositoryPort,
    // @ts-ignore
    @Inject(JOB_REPOSITORY) private readonly jobRepo: JobRepositoryPort,
    // @ts-ignore
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryPort,
    // @ts-ignore
    @Inject(INTEGRATED_ORDER_MODIFICATION_HISTORY_REPOSITORY)
    private readonly orderHistoryRepo: IntegratedOrderModificationHistoryRepositoryPort,
    private readonly serviceInitialPriceManager: ServiceInitialPriceManager,
    private readonly orderModificationValidator: OrderModificationValidator,
    private readonly revisionTypeUpdateValidator: RevisionTypeUpdateValidationDomainService,
  ) {}

  @OnEvent(JobCreatedDomainEvent.name, { async: true, promisify: true })
  async handle(event: JobCreatedDomainEvent) {
    const job = await this.jobRepo.findJobOrThrow(event.aggregateId)
    const project = await this.projectRepo.findOneOrThrow({ id: job.projectId })
    const editor = event.editorUserId ? await this.userRepo.findOneById(event.editorUserId) : null

    const makeEntities = event.services.map(async (orderedService) => {
      // 새로운 스코프가 주문되기 전이라 자신이 포함되지 않음
      const previouslyOrderedServices = await this.orderedServiceRepo.getPreviouslyOrderedServices(
        event.projectId,
        orderedService.serviceId,
      )

      const orderedServiceEntity = await OrderedServiceEntity.create(
        {
          projectId: event.projectId,
          jobId: event.aggregateId,
          isRevision: !!previouslyOrderedServices.length,
          serviceId: orderedService.serviceId,
          serviceName: orderedService.serviceName,
          description: orderedService.description,
          projectPropertyType: event.projectType as ProjectPropertyTypeEnum,
          mountingType: event.mountingType as MountingTypeEnum,
          organizationId: event.organizationId,
          organizationName: event.organizationName,
          projectNumber: project.projectNumber,
          projectPropertyOwnerName: project.projectPropertyOwnerName,
          jobName: job.jobName,
          isExpedited: job.getProps().isExpedited,
          updatedBy: editor ? editor.userName.fullName : null,
          editorUserId: editor ? editor.id : null,
        },
        this.serviceInitialPriceManager,
        this.orderModificationValidator,
        this.revisionTypeUpdateValidator,
      )

      return orderedServiceEntity
    })

    const orderedServiceEntities = await Promise.all(makeEntities)

    await this.orderedServiceRepo.insert(orderedServiceEntities)

    // GENERATE HISTORY
    const createdOrderedServices = await this.orderedServiceRepo.find(
      orderedServiceEntities.map((service) => service.id),
    )
    await Promise.all(
      createdOrderedServices.map(async (orderedService) => {
        await this.orderHistoryRepo.generateCreationHistory(orderedService, editor)
      }),
    )
  }
}

// New Residential (Fixed / 0)
// Residential Revision (Size, Mounting Type)
//    - Free Revision
// New Commercial Tier (System Size, Mounting Type)
// Commercial Revision X
// Fixed Price

/**
 * isFixed?
 *  return price
 *
 * isRevision?
 *  return null -> price is when it turns out it's gm
 *          or Free Revision? Yes -> Done? -> input price
 *
 * new zone
 *
 * is Commercial?
 *  return null
 *
 * isResidential?
 *  return isFixed? -> price or null
 *
 * commercial Zone
 *  return match tier! OR 0
 */

/**
 * NOTE:
 * 이벤트로 처리하면 확실히 종속성을 많이 줄일수 있음, 보내는 측에서 유효성 검사를 하고 보낼수 있으니까,
 * 근데 Request API로 만들어야하는 것은 여전히 유효성 검사를 위해서 다른 Aggregate를 조회해야함.
 *
 * NOTE:
 * 데이터 변경은 Aggregate에서 이루어져야 하는 이유
 * 1. 변경된 데이터가 다른 데이터에 영향을 받을 수 있다. 관련된 데이터를 합쳐놓은 것이 Aggregate.
 * 2. 도메인 이벤트로 변경사항을 관리하기 쉬워진다. (중복된 데이터를 가진 Aggregate가 해당 이벤트를 구독함으로서)
 */
