/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, Injectable } from '@nestjs/common'
import { INVITATION_MAIL_REPOSITORY, USER_REPOSITORY } from './user.di-tokens'
import { EmailVO } from './domain/value-objects/email.vo'
import { InvitationEmailProp } from './domain/invitationMail.types'
import { UserRepositoryPort } from './database/user.repository.port'
import { InvitationMailRepositoryPort } from './database/invitationMail.repository.port'
import { PtoRepositoryPort } from '../pto/database/pto.repository.port'
import { ORGANIZATION_REPOSITORY } from '../organization/organization.di-token'
import { PTO_REPOSITORY } from '../pto/pto.di-token'
import { OrganizationRepositoryPort } from '../organization/database/organization.repository.port'
import { UserResponseDto } from './dtos/user.response.dto'
import { UserEntity } from './domain/user.entity'
import UserMapper from './user.mapper'
import { UserName } from './domain/value-objects/user-name.vo'
import { InvitationNotFoundException, OnlyMemberCanBeAdminException, UserNotFoundException } from './user.error'
import { OrganizationNotFoundException } from '../organization/domain/organization.error'
import { PrismaService } from '../database/prisma.service'
import { Roles } from '@prisma/client'
import { PaidPtoUpdateException } from '../pto/domain/pto.error'

@Injectable()
export class UserService {
  constructor(
    // @ts-ignore
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepositoryPort,
    // @ts-ignore
    @Inject(INVITATION_MAIL_REPOSITORY) private readonly invitationMailRepository: InvitationMailRepositoryPort,
    // @ts-ignore
    @Inject(ORGANIZATION_REPOSITORY) private readonly organizationRepository: OrganizationRepositoryPort,
    // @ts-ignore
    @Inject(PTO_REPOSITORY) private readonly ptoRepository: PtoRepositoryPort,
    private readonly prismaService: PrismaService,
    private readonly userMapper: UserMapper,
  ) {}

  async makeAdmin(userId: string) {
    // TODO: Consider an Aggregate Pattern
    const user = await this.userRepository.findOneByIdOrThrow(userId)
    const organizationEntity = await this.organizationRepository.findOneOrThrow(user.getProps().organization.id)
    if (!organizationEntity || organizationEntity?.getProps().organizationType !== 'Administration') {
      throw new OnlyMemberCanBeAdminException()
    }
    user.makeAdmin()
    await this.userRepository.update(user)
  }

  async getRoles(): Promise<Roles[]> {
    return await this.prismaService.roles.findMany()
  }

  async getUserProfile(userId: string): Promise<UserResponseDto> {
    // TODO: Consider an Aggregate Pattern
    const userEntity = await this.userRepository.findOneByIdOrThrow(userId)
    const organizationEntity = await this.organizationRepository.findOneOrThrow(userEntity.getProps().organization.id)
    if (!organizationEntity) throw new OrganizationNotFoundException()
    return this.userMapper.toResponse(userEntity)
  }

  async updateProfile(
    userId: string,
    userName: UserName,
    phoneNumber: string | null,
    deliverablesEmails: string[],
    isVendor?: boolean,
    dateOfJoining?: Date | null,
  ): Promise<void> {
    const user = await this.userRepository.findOneByIdOrThrow(userId)
    if (!user) throw new UserNotFoundException()

    user.updateName(userName).updatePhoneNumber(phoneNumber).updateDeliverableEmails(deliverablesEmails)
    if (isVendor !== undefined) {
      user.updateVendor(isVendor)
    }
    if (dateOfJoining !== undefined) {
      // TODO: Consider an Aggregate Pattern
      // 만약 Paid 된 Pto존재한다면 입사기념일 수정 불가능
      const paidPtosCount: number = await this.ptoRepository.getCount({
        userId: user.id,
        isPaid: true,
      })

      if (paidPtosCount > 0) {
        throw new PaidPtoUpdateException()
      }

      user.updateDateOfJoining(dateOfJoining)
    }
    await this.userRepository.update(user)
  }

  async findUserIdByEmail(email: EmailVO): Promise<Pick<UserEntity, 'id'>> {
    const result = await this.userRepository.findUserByEmailOrThrow(email)
    if (!result) throw new UserNotFoundException()
    return result
  }

  async findPasswordByUserId(id: string): Promise<string | null> {
    return await this.userRepository.findPasswordByUserId(id)
  }

  async transaction(...args: any[]): Promise<void> {
    return await this.userRepository.transaction(args)
  }

  async findInvitationMail(email: EmailVO): Promise<InvitationEmailProp> {
    const result = await this.invitationMailRepository.findOne(email)
    if (!result) throw new InvitationNotFoundException()
    return result
  }
}
