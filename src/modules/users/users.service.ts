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
import { UserRoleNameEnum } from './domain/value-objects/user-role.vo'
import {
  InvitationNotFoundException,
  OnlyMemberCanBeAdminException,
  UserConflictException,
  UserNotFoundException,
} from './user.error'
import { OrganizationNotFoundException } from '../organization/domain/organization.error'
import { PrismaService } from '../database/prisma.service'

@Injectable()
export class UserService {
  constructor(
    // @ts-ignore
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepositoryPort,
    // @ts-ignore
    @Inject(INVITATION_MAIL_REPOSITORY) private readonly invitationMailRepository: InvitationMailRepositoryPort,
    // @ts-ignore
    @Inject(ORGANIZATION_REPOSITORY) private readonly organizationRepository: OrganizationRepositoryPort,
    private readonly prismaService: PrismaService,
    private readonly userMapper: UserMapper,
  ) {}

  async makeAdmin(userId: string) {
    // TODO: Consider an Aggregate Pattern
    const user = await this.userRepository.findOneById(userId)
    const organizationEntity = await this.organizationRepository.findOneOrThrow(user.getProps().organization.id)
    if (!organizationEntity || organizationEntity?.getProps().organizationType !== 'Administration') {
      throw new OnlyMemberCanBeAdminException()
    }
    user.makeAdmin()
    await this.userRepository.update(user)
  }

  async getRoles(): Promise<UserRoleNameEnum[]> {
    return [UserRoleNameEnum.guest, UserRoleNameEnum.member]
  }

  async getUserProfile(userId: string): Promise<UserResponseDto> {
    // TODO: Consider an Aggregate Pattern
    const userEntity = await this.userRepository.findOneById(userId)
    const organizationEntity = await this.organizationRepository.findOneOrThrow(userEntity.getProps().organization.id)
    if (!organizationEntity) throw new OrganizationNotFoundException()
    return this.userMapper.toResponse(userEntity)
  }

  async upadteProfile(
    userId: string,
    userName: UserName,
    phoneNumber: string | null,
    deliverablesEmails: string[],
  ): Promise<void> {
    const user = await this.userRepository.findOneById(userId)
    if (!user) throw new UserNotFoundException()

    user
      .updateName(userName) //
      .updatePhoneNumber(phoneNumber)
      .updateDeliverableEmails(deliverablesEmails)

    await this.userRepository.update(user)
  }

  async findUserIdByEmail(email: EmailVO): Promise<Pick<UserEntity, 'id'>> {
    const result = await this.userRepository.findUserIdByEmail(email)
    if (!result) throw new UserNotFoundException()
    return result
  }

  async findPasswordByUserId(id: string): Promise<string | null> {
    return await this.userRepository.findPasswordByUserId(id)
  }

  // 뭔가 service to service로 사용되는 메서드여서 그런지 구현이 이상한 느낌?
  async insertUser(entity: UserEntity, password: InputPasswordVO) {
    return await this.userRepository.insertUser(entity, password)
  }

  async deleteInvitationMail(code: string): Promise<void> {
    await this.invitationMailRepository.deleteOne(code)
  }

  async transaction(...args: any[]): Promise<void> {
    return await this.userRepository.transaction(args)
  }

  async findInvitationMail(code: string, email: EmailVO): Promise<InvitationEmailProp> {
    const result = await this.invitationMailRepository.findOne(code, email)
    if (!result) throw new InvitationNotFoundException()
    return result
  }

  async sendInvitationMail(dto: CreateInvitationMailRequestDto, code: string): Promise<InvitationEmailProp> {
    try {
      const user = await this.prismaService.users.findUnique({
        where: { email: dto.email },
      })
      if (user) throw new UserConflictException()

      // What if organizationId is provided by parameter?
      const organization = await this.organizationRepository.findOneByName(dto.organizationName)
      if (!organization) throw new OrganizationNotFoundException()

      await this.invitationMailRepository.insertOne({
        email: dto.email,
        code: code,
        role: UserRoleNameEnum.guest,
        organizationId: organization.id,
      })
      return {
        email: dto.email,
        code: code,
        role: UserRoleNameEnum.guest,
        organizationId: organization.id,
        updatedAt: new Date(),
        createdAt: new Date(),
      }
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error
      }
      throw new InternalServerErrorException()
    }
  }

  // async findAllLicenses(): Promise<LicenseEntity[]> {
  //   return await this.userRepository.findAllLicenses()
  // }

  // async registerLicense(
  //   userId: string,
  //   type: LicenseType,
  //   issuingCountryName: string,
  //   abbreviation: string,
  //   priority: number,
  //   expiryDate: Date | null,
  // ): Promise<void> {
  //   const user = await this.userRepository.findOneById(userId)

  //   const existed = await this.userRepository.findLicensesByUser(user)
  //   const filterd = existed.map((license) => {
  //     const state = license.getProps().stateEntity
  //     return state.abbreviation === abbreviation && license.getProps().type === type
  //   })

  //   if (filterd.includes(true)) throw new ConflictException('already has a license.', '10015')

  //   await this.userRepository.registerLicense(
  //     new LicenseEntity({
  //       userId,
  //       userName: user.getProps().userName,
  //       type,
  //       stateEntity: new State({
  //         stateName: issuingCountryName,
  //         abbreviation,
  //         geoId: null,
  //         stateCode: null,
  //         ansiCode: null,
  //         stateLongName: null,
  //       }),
  //       priority,
  //       // issuedDate,
  //       expiryDate,
  //     }),
  //   )
  // }

  // async revokeLicense(userId: string, type: LicenseType, issuingCountryName: string): Promise<void> {
  //   const user = await this.userRepository.findOneById(userId)
  //   const existed = await this.userRepository.findLicensesByUser(user)
  //   const filterd = existed.map((license) => {
  //     const state = license.getProps().stateEntity
  //     return state.stateName === issuingCountryName && license.getProps().type === type
  //   })
  //   if (!filterd.includes(true)) throw new NotFoundException('has no a license.', '10016')
  //   await this.userRepository.revokeLicense(userId, type, issuingCountryName)
  // }
}
