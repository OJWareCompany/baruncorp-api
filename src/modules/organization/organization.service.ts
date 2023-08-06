import { Inject, Injectable } from '@nestjs/common'
import { ORGANIZATION_REPOSITORY } from './organization.di-token'
import { OrganizationRepositoryPort } from './database/organization.repository.port'
import { UserRepositoryPort } from '../users/database/user.repository.port'
import { USER_REPOSITORY } from '../users/user.di-tokens'
import { UserResponseDto } from '../users/dtos/user.response.dto'
import UserMapper from '../users/user.mapper'
import { PositionMapper } from '../department/position.mapper'
import { LicenseMapper } from '../department/license.mapper'
import { DepartmentRepositoryPort } from '../department/database/department.repository.port'
import { DEPARTMENT_REPOSITORY } from '../department/department.di-token'
import { OrganizationMapper } from './organization.mapper'
import { ServiceMapper } from '../department/service.mapper'
import { OrganizationEntity } from './domain/organization.entity'
import { OrganizationResponseDto } from './dtos/organization.response.dto'

@Injectable()
export class OrganizationService {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY) private readonly organizationRepository: OrganizationRepositoryPort,
    @Inject(DEPARTMENT_REPOSITORY) private readonly departmentRepository: DepartmentRepositoryPort,
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepositoryPort,
    private readonly organizationMapper: OrganizationMapper,
    private readonly userMapper: UserMapper,
    private readonly positionMapper: PositionMapper,
    private readonly licenseMapper: LicenseMapper,
    private readonly serviceMapper: ServiceMapper,
  ) {}

  async findOrganizationById(organizationId: string): Promise<OrganizationEntity> {
    return await this.organizationRepository.findOneById(organizationId)
  }

  async findAll(): Promise<OrganizationResponseDto[]> {
    const entities = await this.organizationRepository.findAll()
    return entities.map(this.organizationMapper.toResponse)
  }

  /**
   * TODO: Aggregate 구현하기
   *
   * 유저를 조회할때 관련된 정보를 함께 조회해야한다. (조직, 자격증, 등)
   * Domain Service는 DTO가 아닌 Entity를 반환해야하므로 Application Service에서 각각의 정보들을 조회하고 조합해서 응답한다.
   * 유저 리스트를 조회할때 application 메서드를 재사용하게 되면, 10명의 유저를 조회했을때 10번의 메서드가 반복된다.
   * 그럼 database call이 불필요하게 많이 생긴다.
   *
   * 어쨋든! 유저의 정보가 담긴 객체 (UserEntity)는 항상 다른 테이블을 join하여서 쓰려고 하는 상황이다.
   * 이때! Aggregate 개념이 필요한 것 같다! (여러가지 Entity의 묶음)
   */
  async findMembersByOrganizationId(organizationId: string): Promise<UserResponseDto[]> {
    const userEntity = await this.userRepository.findByOrganizationId(organizationId)
    const organization = await this.organizationRepository.findOneById(organizationId)
    const result: Promise<UserResponseDto>[] = userEntity.map(async (user) => {
      const userRoleEntity = await this.userRepository.findRoleByUserId(user.id)
      const positionEntity = await this.departmentRepository.findPositionByUserId(user.id)
      const servicesEntity = await this.departmentRepository.findServicesByUserId(user.id)
      const licenseEntities = await this.userRepository.findLicensesByUser(user)
      return this.userMapper.toResponse(
        user,
        userRoleEntity,
        organization,
        this.positionMapper.toResponse(positionEntity),
        servicesEntity.map(this.serviceMapper.toResponse),
        licenseEntities.map(this.licenseMapper.toResponse),
      )
    })

    return Promise.all(result)
  }
}
