/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import UserMapper from '../../../users/user.mapper'
import { USER_REPOSITORY } from '../../../users/user.di-tokens'
import { UserRepositoryPort } from '../../../users/database/user.repository.port'
import { generateUserResponse } from '../../../users/domain/generate-user-response.domain-service'
import { UserResponseDto } from '../../../users/dtos/user.response.dto'
import { DEPARTMENT_REPOSITORY } from '../../../department/department.di-token'
import { OrganizationRepositoryPort } from '../../database/organization.repository.port'
import { DepartmentRepositoryPort } from '../../../department/database/department.repository.port'
import { PrismaService } from '../../../database/prisma.service'
import { PositionMapper } from '../../../department/position.mapper'
import { LicenseMapper } from '../../../department/license.mapper'
import { ServiceMapper } from '../../../department/service.mapper'
import { UserNotFoundException } from '../../../users/user.error'
import { ORGANIZATION_REPOSITORY } from '../../organization.di-token'

export class FindMyMemberPaginatedQuery extends PaginatedQueryBase {
  readonly userId: string
  constructor(props: PaginatedParams<FindMyMemberPaginatedQuery>) {
    super(props)
    initialize(this, props)
  }
}

@QueryHandler(FindMyMemberPaginatedQuery)
export class FindMyMemberPaginatedQueryHandler implements IQueryHandler {
  constructor(
    // @ts-ignore
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepositoryPort,
    // @ts-ignore
    @Inject(ORGANIZATION_REPOSITORY) private readonly organizationRepository: OrganizationRepositoryPort,
    // @ts-ignore
    @Inject(DEPARTMENT_REPOSITORY) private readonly departmentRepository: DepartmentRepositoryPort,
    private readonly prismaService: PrismaService,
    private readonly userMapper: UserMapper,
    private readonly positionMapper: PositionMapper,
    private readonly licenseMapper: LicenseMapper,
    private readonly serviceMapper: ServiceMapper,
  ) {}
  async execute(query: FindMyMemberPaginatedQuery): Promise<Paginated<UserResponseDto>> {
    const user = await this.prismaService.users.findUnique({
      where: { id: query.userId },
    })

    if (!user) throw new UserNotFoundException()

    const records = await this.prismaService.users.findMany({
      where: { organizationId: user.organizationId },
    })

    const userEntities = records && records.map(this.userMapper.toDomain)

    const result: UserResponseDto[] = await generateUserResponse(
      userEntities,
      this.userRepository,
      this.organizationRepository,
      this.departmentRepository,
      this.userMapper,
      this.positionMapper,
      this.serviceMapper,
      this.licenseMapper,
    )

    const totalCount = await this.prismaService.users.count({
      where: { organizationId: user.organizationId },
    })

    return new Paginated({
      items: result,
      totalCount: totalCount,
      page: query.limit,
      pageSize: query.limit,
    })
  }
}
