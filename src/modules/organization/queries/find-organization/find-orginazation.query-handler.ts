/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { ORGANIZATION_REPOSITORY } from '../../organization.di-token'
import { OrganizationRepositoryPort } from '../../database/organization.repository.port'
import { OrganizationMapper } from '../../organization.mapper'
import { OrganizationResponseDto } from '../../dtos/organization.response.dto'
import { OrganizationNotFoundException } from '../../domain/organization.error'

export class FindOrganizationQuery {
  public readonly organizationId: string

  constructor(props: FindOrganizationQuery) {
    initialize(this, props)
  }
}

@QueryHandler(FindOrganizationQuery)
export class FindOrganizationQueryHandler implements IQueryHandler {
  constructor(
    // @ts-ignore
    @Inject(ORGANIZATION_REPOSITORY) private readonly organizationRepository: OrganizationRepositoryPort,
    private readonly organizationMapper: OrganizationMapper,
  ) {}
  async execute(query: FindOrganizationQuery): Promise<OrganizationResponseDto> {
    const result = await this.organizationRepository.findOneOrThrow(query.organizationId)
    if (!result) throw new OrganizationNotFoundException()
    console.log(2)
    return this.organizationMapper.toResponse(result)
  }
}
