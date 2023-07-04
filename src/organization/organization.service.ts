import { ConflictException, Inject, Injectable } from '@nestjs/common'
import { ORGANIZATION_REPOSITORY } from './organization.di-token'
import { OrganizationRepositoryPort } from './database/organization.repository.port'
import { OrganizationProp } from './interfaces/organization.interface'
import { UserRepositoryPort } from '../users/database/user.repository.port'
import { USER_REPOSITORY } from '../users/user.di-tokens'
import { UserResponseDto } from '../users/dto/req/user.response.dto'
import UserMapper from '../users/user.mapper'
import { PositionMapper } from '../department/position.mapper'
import { LicenseMapper } from '../department/license.mapper'
import { DepartmentRepositoryPort } from '../department/database/department.repository.port'
import { DEPARTMENT_REPOSITORY } from '../department/department.di-token'

@Injectable()
export class OrganizationService {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY) private readonly organizationRepository: OrganizationRepositoryPort,
    @Inject(DEPARTMENT_REPOSITORY) private readonly departmentRepository: DepartmentRepositoryPort,
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepositoryPort,
    private readonly userMapper: UserMapper,
    private readonly positionMapper: PositionMapper,
    private readonly licenseMapper: LicenseMapper,
  ) {}

  // TODO: remove id field!
  async createOrganization(props: Omit<OrganizationProp, 'id'>): Promise<OrganizationProp> {
    const organization = await this.organizationRepository.findOneByName(props.name)
    if (organization) throw new ConflictException(`${props.name} is aleady existed.`, '20001')
    return await this.organizationRepository.insertOrganization(props)
  }

  async findOrganizationById(organizationId: string): Promise<OrganizationProp> {
    return await this.organizationRepository.findOneById(organizationId)
  }

  async findAll(): Promise<OrganizationProp[]> {
    return await this.organizationRepository.findAll()
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
    const result: Promise<UserResponseDto>[] = userEntity.map(async (user) => {
      const positionEntity = await this.departmentRepository.findPositionByUserId(user.id)
      const licenseEntities = await this.departmentRepository.findLicensesByUser(user)
      const userRoleEntity = await this.userRepository.findRoleByUserId(user.id)
      return this.userMapper.toResponse(
        user,
        userRoleEntity,
        this.positionMapper.toResponse(positionEntity),
        licenseEntities.map(this.licenseMapper.toResponse),
      )
    })

    return Promise.all(result)
  }
}
