/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { PrismaService } from '../../../database/prisma.service'
import { UserRepositoryPort } from '../../database/user.repository.port'
import UserMapper from '../../user.mapper'
import { OrganizationRepositoryPort } from '../../../organization/database/organization.repository.port'
import { DepartmentRepositoryPort } from '../../../department/database/department.repository.port'
import { LicenseMapper } from '../../../department/license.mapper'
import { PositionMapper } from '../../../department/position.mapper'
import { ServiceMapper } from '../../../department/service.mapper'
import { UserResponseDto } from '../../dtos/user.response.dto'
import { ORGANIZATION_REPOSITORY } from '../../../organization/organization.di-token'
import { USER_REPOSITORY } from '../../user.di-tokens'
import { DEPARTMENT_REPOSITORY } from '../../../department/department.di-token'
import { FindUsersQuery } from './find-user.query'

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

  async execute(query: FindUsersQuery): Promise<UserResponseDto[]> {
    const records = await this.prismaService.users.findMany({
      where: {
        ...(query.email && { email: query.email }),
        ...(query.organizationId && { organizationId: query.organizationId }),
      },
    })
    const userEntities = records && records.map(this.userMapper.toDomain)

    const result: Promise<UserResponseDto>[] = userEntities.map(async (user) => {
      const userRoleEntity = await this.userRepository.findRoleByUserId(user.id)
      const organizationEntity = await this.organizationRepository.findOneById(user.getProps().organizationId)
      const positionEntity = await this.departmentRepository.findPositionByUserId(user.id)
      const serviceEntities = await this.departmentRepository.findServicesByUserId(user.id)
      const licenseEntities = await this.userRepository.findLicensesByUser(user)
      return this.userMapper.toResponse(
        user,
        userRoleEntity,
        organizationEntity,
        positionEntity ? this.positionMapper.toResponse(positionEntity) : null,
        serviceEntities.map(this.serviceMapper.toResponse),
        licenseEntities.map(this.licenseMapper.toResponse),
      )
    })

    return Promise.all(result)
  }
}
