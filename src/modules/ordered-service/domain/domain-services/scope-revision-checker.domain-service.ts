/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { OrderedServiceRepositoryPort } from '../../database/ordered-service.repository.port'
import { ORDERED_SERVICE_REPOSITORY } from '../../ordered-service.di-token'
import { OrderedServiceEntity } from '../ordered-service.entity'
import { ValidScopeStatus } from '../value-objects/valid-previously-scope-status.value-object'

export class ScopeRevisionChecker {
  constructor(
    // @ts-ignore
    @Inject(ORDERED_SERVICE_REPOSITORY) private readonly orderedScopeRepo: OrderedServiceRepositoryPort,
  ) {}
  async isRevision(entity: OrderedServiceEntity): Promise<boolean> {
    const previousSameScopes = await this.orderedScopeRepo.findPreviousSameScopesInProject(
      entity.projectId,
      entity.serviceId,
      entity.orderedAt,
      new ValidScopeStatus(),
    )

    const previousOrderedScopes = previousSameScopes.filter((pre) => pre.id !== entity.id)

    return previousOrderedScopes.length > 0
  }
}

// 좀.. 해석할 필요 없게 단순하게 쓰자 좀!!
// 영속성 조회도 간단하게!! (find에 유연한 매개변수 타입을 선언할 여유가 없다!)
