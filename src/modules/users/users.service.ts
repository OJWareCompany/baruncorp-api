/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ConflictException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { INVITATION_MAIL_REPOSITORY, USER_REPOSITORY } from './user.di-tokens'
import { EmailVO } from './domain/value-objects/email.vo'
import { InputPasswordVO } from './domain/value-objects/password.vo'
import { InvitationEmailProp } from './domain/invitationMail.types'
import { UserRepositoryPort } from './database/user.repository.port'
import { InvitationMailRepositoryPort } from './database/invitationMail.repository.port'
import { CreateInvitationMailRequestDto } from './commands/create-invitation-mail/create-invitation-mail.request.dto'
import { ORGANIZATION_REPOSITORY } from '../organization/organization.di-token'
import { OrganizationRepositoryPort } from '../organization/database/organization.repository.port'
import { UserResponseDto } from './dtos/user.response.dto'
import { UserEntity } from './domain/user.entity'
import UserMapper from './user.mapper'
import { UserName } from './domain/value-objects/user-name.vo'
import { DEPARTMENT_REPOSITORY } from '../department/department.di-token'
import { DepartmentRepositoryPort } from '../department/database/department.repository.port'
import { PositionMapper } from '../department/position.mapper'
import { LicenseMapper } from '../department/license.mapper'
import { ServiceMapper } from '../department/service.mapper'
import { CreateUserRoleProps, UserRole, UserRoles } from './domain/value-objects/user-role.vo'
import { LicenseEntity } from './user-license.entity'
import { State } from '../department/domain/value-objects/state.vo'
import { LicenseType } from './user-license.type'
import { PrismaService } from '../database/prisma.service'
import { FindUserRqeustDto } from './queries/find-users/find-user.request.dto'

@Injectable()
export class UserService {
  constructor(
    // @ts-ignore
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepositoryPort,
    // @ts-ignore
    @Inject(INVITATION_MAIL_REPOSITORY) private readonly invitationEmailRepository: InvitationMailRepositoryPort,
    // @ts-ignore
    @Inject(ORGANIZATION_REPOSITORY) private readonly organizationRepository: OrganizationRepositoryPort,
    // @ts-ignore
    @Inject(DEPARTMENT_REPOSITORY) private readonly departmentRepository: DepartmentRepositoryPort,
    private readonly userMapper: UserMapper,
    private readonly positionMapper: PositionMapper,
    private readonly licenseMapper: LicenseMapper,
    private readonly serviceMapper: ServiceMapper,
  ) {}

  async giveRole(create: CreateUserRoleProps): Promise<void> {
    const role = new UserRole(create)
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
    const userRoleEntity = await this.userRepository.findRoleByUserId(userEntity.id)
    const organizationEntity = await this.organizationRepository.findOneById(userEntity.getProps().organizationId)
    const positionEntity = await this.departmentRepository.findPositionByUserId(userEntity.id)
    const serviceEntities = await this.departmentRepository.findServicesByUserId(userEntity.id)
    const licenseEntities = await this.userRepository.findLicensesByUser(userEntity)
    return this.userMapper.toResponse(
      userEntity,
      userRoleEntity,
      organizationEntity,
      this.positionMapper.toResponse(positionEntity),
      serviceEntities.map(this.serviceMapper.toResponse),
      licenseEntities.map(this.licenseMapper.toResponse),
    )
  }

  async upadteProfile(userId: string, userName: UserName): Promise<void> {
    await this.userRepository.update(userId, userName)
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

  async sendInvitationMail(dto: CreateInvitationMailRequestDto, code: string): Promise<InvitationEmailProp> {
    try {
      const user = await this.userRepository.findOneByEmail(new EmailVO(dto.email))
      // What if organizationId is provided by parameter?
      const organization = await this.organizationRepository.findOneByName(dto.organizationName)
      if (user) throw new ConflictException('User Already Existed')
      await this.invitationEmailRepository.insertOne({
        email: dto.email,
        code: code,
        role: UserRoles.guest,
        organizationId: organization.id,
      })
      return {
        email: dto.email,
        code: code,
        role: UserRoles.guest,
        organizationId: organization.id,
        updatedAt: new Date(),
        createdAt: new Date(),
      }
    } catch (error) {
      console.log(error)
      if ((error.message = 'User Already Existed')) throw new ConflictException(error.message, '10017')
      else throw new InternalServerErrorException()
    }
  }

  async findAllLicenses(): Promise<LicenseEntity[]> {
    return await this.userRepository.findAllLicenses()
  }

  async registerLicense(
    userId: string,
    type: LicenseType,
    issuingCountryName: string,
    abbreviation: string,
    priority: number,
    // issuedDate: Date,
    expiryDate: Date,
  ): Promise<void> {
    const user = await this.userRepository.findOneById(userId)

    const existed = await this.userRepository.findLicensesByUser(user)
    const filterd = existed.map((license) => {
      const state = license.getProps().stateEntity
      return state.abbreviation === abbreviation && license.getProps().type === type
    })

    if (filterd.includes(true)) throw new ConflictException('already has a license.', '10015')

    await this.userRepository.registerLicense(
      new LicenseEntity({
        userId,
        userName: user.getProps().userName,
        type,
        stateEntity: new State({ stateName: issuingCountryName, abbreviation }),
        priority,
        // issuedDate,
        expiryDate,
      }),
    )
  }

  async revokeLicense(userId: string, type: LicenseType, issuingCountryName: string): Promise<any> {
    const user = await this.userRepository.findOneById(userId)
    const existed = await this.userRepository.findLicensesByUser(user)
    const filterd = existed.map((license) => {
      const state = license.getProps().stateEntity
      return state.stateName === issuingCountryName && license.getProps().type === type
    })
    if (!filterd.includes(true)) throw new NotFoundException('has no a license.', '10016')
    return await this.userRepository.revokeLicense(userId, type, issuingCountryName)
  }
}
