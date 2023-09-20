/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PrismaService } from '../../../database/prisma.service'
import { OrganizationRepositoryPort } from '../../../organization/database/organization.repository.port'
import { DepartmentRepositoryPort } from '../../../department/database/department.repository.port'
import { LicenseMapper } from '../../../department/license.mapper'
import { PositionMapper } from '../../../department/position.mapper'
import { ServiceMapper } from '../../../department/service.mapper'
import { ORGANIZATION_REPOSITORY } from '../../../organization/organization.di-token'
import { DEPARTMENT_REPOSITORY } from '../../../department/department.di-token'
import { UserRepositoryPort } from '../../database/user.repository.port'
import { UserResponseDto } from '../../dtos/user.response.dto'
import { USER_REPOSITORY } from '../../user.di-tokens'
import { FindUsersQuery } from './find-user.query'
import UserMapper from '../../user.mapper'
import { generateUserResponse } from '../../domain/generate-user-response.domain-service'

@QueryHandler(FindUsersQuery)
export class FindUserQueryHandler implements IQueryHandler {
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

  async execute(query: FindUsersQuery): Promise<Paginated<UserResponseDto>> {
    const whereInput: Prisma.UsersWhereInput = {
      ...(query.email && { email: query.email }),
      ...(query.organizationId && { organizationId: query.organizationId }),
    }

    const records = await this.prismaService.users.findMany({ where: whereInput })
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
      where: whereInput,
    })

    return new Paginated({
      items: result,
      page: query.page,
      pageSize: query.limit,
      totalCount: totalCount,
    })
  }
}
