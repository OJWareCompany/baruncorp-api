import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { INVITATION_MAIL_REPOSITORY, USER_REPOSITORY } from './user.di-tokens'
import { EmailVO } from './vo/email.vo'
import { InputPasswordVO } from './vo/password.vo'
import { InvitationEmailProp } from './interfaces/invitationMail.interface'
import { UserRepositoryPort } from './database/user.repository.port'
import { InvitationMailRepositoryPort } from './database/invitationMail.repository.port'
import { CreateInvitationMailReq } from './dto/req/create-invitation-mail.req'
import { ORGANIZATION_REPOSITORY } from '../organization/organization.di-token'
import { OrganizationRepositoryPort } from '../organization/database/organization.repository.port'
import { UserResponseDto } from './dto/req/user.response.dto'
import { UserEntity } from './entities/user.entity'
import UserMapper from './user.mapper'
import { UserName } from './vo/user-name.vo'
import { DEPARTMENT_REPOSITORY } from '../department/department.di-token'
import { DepartmentRepositoryPort } from '../department/database/department.repository.port'
import { PositionMapper } from '../department/position.mapper'
import { LicenseMapper } from '../department/license.mapper'
import { CreateUserRoleProps, UserRoles } from './interfaces/user-role.interface'
import { UserRoleEntity } from './entities/user-role.entity'

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepositoryPort,
    @Inject(INVITATION_MAIL_REPOSITORY) private readonly invitationEmailRepository: InvitationMailRepositoryPort,
    @Inject(ORGANIZATION_REPOSITORY) private readonly organizationRepository: OrganizationRepositoryPort,
    @Inject(DEPARTMENT_REPOSITORY) private readonly departmentRepository: DepartmentRepositoryPort,
    private readonly userMapper: UserMapper,
    private readonly positionMapper: PositionMapper,
    private readonly licenseMapper: LicenseMapper,
  ) {}

  async giveRole(create: CreateUserRoleProps): Promise<void> {
    const role = new UserRoleEntity(create)
    const existed = await this.userRepository.findRoleByUserId(create.userId)
    if (existed) throw new ConflictException('already has roles.', '10011')
    await this.userRepository.giveRole(role)
  }

  async removeRole(userId: string): Promise<void> {
    const existed = await this.userRepository.findRoleByUserId(userId)
    if (!existed) throw new NotFoundException('no roles.', '10012')
    const userRoleEntity = await this.userRepository.findRoleByUserId(userId)
    await this.userRepository.removeRole(userRoleEntity)
  }

  async getRoles(): Promise<UserRoles[]> {
    return [UserRoles.guest, UserRoles.member]
  }

  async getUserProfile(userId: string): Promise<UserResponseDto> {
    // TODO: Consider an Aggregate Pattern
    const userEntity = await this.userRepository.findOneById(userId)
    const organizationEntity = await this.organizationRepository.findOneById(userEntity.getProps().organizationId)
    const positionEntity = await this.departmentRepository.findPositionByUserId(userEntity.id)
    const licenseEntities = await this.departmentRepository.findLicensesByUser(userEntity)
    const userRoleEntity = await this.userRepository.findRoleByUserId(userEntity.id)
    return this.userMapper.toResponse(
      userEntity,
      userRoleEntity,
      organizationEntity,
      this.positionMapper.toResponse(positionEntity),
      licenseEntities.map(this.licenseMapper.toResponse),
    )
  }

  async upadteProfile(userId: string, userName: UserName): Promise<void> {
    await this.userRepository.update(userId, userName)
  }

  async findUsers(): Promise<UserResponseDto[]> {
    const userEntity = await this.userRepository.findAll()
    const result: Promise<UserResponseDto>[] = userEntity.map(async (user) => {
      const organizationEntity = await this.organizationRepository.findOneById(user.getProps().organizationId)
      const positionEntity = await this.departmentRepository.findPositionByUserId(user.id)
      const licenseEntities = await this.departmentRepository.findLicensesByUser(user)
      const userRoleEntity = await this.userRepository.findRoleByUserId(user.id)
      return this.userMapper.toResponse(
        user,
        userRoleEntity,
        organizationEntity,
        this.positionMapper.toResponse(positionEntity),
        licenseEntities.map(this.licenseMapper.toResponse),
      )
    })

    return Promise.all(result)
  }

  async findOneByEmail(email: EmailVO): Promise<UserResponseDto> {
    const userEntity = await this.userRepository.findOneByEmail(email)
    const organizationEntity = await this.organizationRepository.findOneById(userEntity.getProps().organizationId)
    const positionEntity = await this.departmentRepository.findPositionByUserId(userEntity.id)
    const licenseEntities = await this.departmentRepository.findLicensesByUser(userEntity)
    const userRoleEntity = await this.userRepository.findRoleByUserId(userEntity.id)

    return this.userMapper.toResponse(
      userEntity,
      userRoleEntity,
      organizationEntity,
      this.positionMapper.toResponse(positionEntity),
      licenseEntities.map(this.licenseMapper.toResponse),
    )
  }

  async findUserIdByEmail(email: EmailVO): Promise<Pick<UserEntity, 'id'>> {
    return await this.userRepository.findUserIdByEmail(email)
  }

  async findPasswordByUserId(id: string): Promise<string> {
    return await this.userRepository.findPasswordByUserId(id)
  }

  // 뭔가 service to service로 사용되는 메서드여서 그런지 구현이 이상한 느낌?
  async insertUser(entity: UserEntity, password: InputPasswordVO) {
    return await this.userRepository.insertUser(entity, password)
  }

  async deleteInvitationMail(code: string): Promise<void> {
    await this.invitationEmailRepository.deleteOne(code)
  }

  async transaction(...args: any[]): Promise<void> {
    return await this.userRepository.transaction(args)
  }

  async findInvitationMail(code: string, email: EmailVO): Promise<InvitationEmailProp> {
    return await this.invitationEmailRepository.findOne(code, email)
  }

  async sendInvitationMail(dto: CreateInvitationMailReq, code: string): Promise<InvitationEmailProp> {
    try {
      const user = await this.userRepository.findOneByEmail(new EmailVO(dto.email))
      // What if organizationId is provided by parameter?
      const organization = await this.organizationRepository.findOneByName(dto.organizationName)
      if (user) throw new ConflictException('User Already Existed')
      return await this.invitationEmailRepository.insertOne({
        email: dto.email,
        code: code,
        role: UserRoles.guest,
        organizationId: organization.id,
      })
    } catch (error) {
      console.log(error)
    }
  }
}
