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
    let totalDurationInMinutes = new Date(job.createdAt)

    if (job.getProps().isManualDueDate) {
      return totalDurationInMinutes
    }

    const DAY_TO_MINUTES = 1440

    const orderedScopes = await this.orderedScopeRepo.findBy({ jobId: job.id })

    const calcTotal = orderedScopes.map(async (orderedScope) => {
      const duration = await this.calcDuration(orderedScope)
      totalDurationInMinutes = addMinutes(totalDurationInMinutes, duration * DAY_TO_MINUTES)
    })

    await Promise.all(calcTotal)

    return totalDurationInMinutes
  }

  private async calcDuration(orderedScope: OrderedServiceEntity) {
    const project = await this.projectRepo.findOneOrThrow({ id: orderedScope.projectId })
    const scope = await this.serviceRepo.findOneOrThrow(orderedScope.serviceId)
    const isRevision = await this.scopeRevisionChecker.isRevision(orderedScope)
    return scope.getTaskDuration(project.projectPropertyType, isRevision) || 0
  }
}
