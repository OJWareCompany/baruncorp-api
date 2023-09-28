/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { Paginated } from '../../../../libs/ddd/repository.port'
import UserMapper from '../../../users/user.mapper'
import { USER_REPOSITORY } from '../../../users/user.di-tokens'
import { UserRepositoryPort } from '../../../users/database/user.repository.port'
import { UserResponseDto } from '../../../users/dtos/user.response.dto'
import { OrganizationRepositoryPort } from '../../database/organization.repository.port'
import { PrismaService } from '../../../database/prisma.service'
import { ORGANIZATION_REPOSITORY } from '../../organization.di-token'
import { UserRepository } from '../../../users/database/user.repository'

export class FindMemberPaginatedQuery extends PaginatedQueryBase {
  readonly organizationId: string
  constructor(props: PaginatedParams<FindMemberPaginatedQuery>) {
    super(props)
    initialize(this, props)
  }
}

@QueryHandler(FindMemberPaginatedQuery)
export class FindMemberPaginatedQueryHandler implements IQueryHandler {
  constructor(
    // @ts-ignore
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepositoryPort,
    // @ts-ignore
    @Inject(ORGANIZATION_REPOSITORY) private readonly organizationRepository: OrganizationRepositoryPort,
    private readonly prismaService: PrismaService,
    private readonly userMapper: UserMapper,
  ) {}
  async execute(query: FindMemberPaginatedQuery): Promise<Paginated<UserResponseDto>> {
    const records = await this.prismaService.users.findMany({
      where: { organizationId: query.organizationId },
      include: UserRepository.userQueryIncludeInput,
      skip: query.offset,
      take: query.limit,
    })

    const result = records.map(this.userMapper.toDomain).map(this.userMapper.toResponse)

    const totalCount = await this.prismaService.users.count({
      where: { organizationId: query.organizationId },
    })

    return new Paginated({
      items: result,
      totalCount: totalCount,
      page: query.page,
      pageSize: query.limit,
    })
  }
}
