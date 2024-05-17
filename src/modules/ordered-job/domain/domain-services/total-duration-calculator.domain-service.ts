/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { addMinutes } from 'date-fns'
import { OrderedServiceRepositoryPort } from '../../../ordered-service/database/ordered-service.repository.port'
import { ORDERED_SERVICE_REPOSITORY } from '../../../ordered-service/ordered-service.di-token'
import { ProjectRepositoryPort } from '../../../project/database/project.repository.port'
import { ServiceRepositoryPort } from '../../../service/database/service.repository.port'
import { ScopeRevisionChecker } from '../../../ordered-service/domain/domain-services/scope-revision-checker.domain-service'
import { OrderedServiceEntity } from '../../../ordered-service/domain/ordered-service.entity'
import { SERVICE_REPOSITORY } from '../../../service/service.di-token'
import { PROJECT_REPOSITORY } from '../../../project/project.di-token'
import { JobEntity } from '../job.entity'
import { OrderedServiceStatusEnum } from '../../../ordered-service/domain/ordered-service.type'

export class TotalDurationCalculator {
  constructor(
    // @ts-ignore
    @Inject(ORDERED_SERVICE_REPOSITORY) private readonly orderedScopeRepo: OrderedServiceRepositoryPort,
    // @ts-ignore
    @Inject(PROJECT_REPOSITORY) private readonly projectRepo: ProjectRepositoryPort,
    // @ts-ignore
    @Inject(SERVICE_REPOSITORY) private readonly serviceRepo: ServiceRepositoryPort,
    private readonly scopeRevisionChecker: ScopeRevisionChecker,
  ) {}

  async calcDueDate(job: JobEntity): Promise<Date> {
    if (job.isManualDueDate && job.dueDate) {
      return job.dueDate
    }

    // Duration이 0.5일 때 0.5일로 변환하기 위해서 사용되는 하루를 분 단위로 표현한 변수
    const DAY_TO_MINUTES = 1440

    const orderedScopes = await this.orderedScopeRepo.findBy({ jobId: job.id })

    let totalDurationInMinutes = new Date(job.createdAt)
    for (const orderedScope of orderedScopes) {
      const duration = await this.calcDuration(orderedScope)
      if (orderedScope.status === OrderedServiceStatusEnum.Canceled) {
        continue
      }

      // TODO: 병렬 진행 작업이 존재하면서 상대적으로 소요시간이 적다면 스킵한다.

      totalDurationInMinutes = addMinutes(totalDurationInMinutes, duration * DAY_TO_MINUTES)
    }

    // TODO: 보류된 기간만큼 마감 기한을 늘린다.

    return totalDurationInMinutes
  }

  /**
   * @param orderedScope
   * @returns 0.5 Day
   */
  private async calcDuration(orderedScope: OrderedServiceEntity): Promise<number> {
    const project = await this.projectRepo.findOneOrThrow({ id: orderedScope.projectId })
    const scope = await this.serviceRepo.findOneOrThrow(orderedScope.serviceId)
    const isRevision = await this.scopeRevisionChecker.isRevision(orderedScope)
    return scope.getTaskDuration(project.projectPropertyType, isRevision) || 0
  }
}
