import { ConflictException, Inject, Injectable } from '@nestjs/common'
import { INVITATION_MAIL_REPOSITORY, USER_REPOSITORY } from './user.di-tokens'
import { EmailVO } from './vo/email.vo'
import { InputPasswordVO } from './vo/password.vo'
import { UserProp, UserRoles } from './interfaces/user.interface'
import { InvitationEmailProp } from './interfaces/invitationMail.interface'
import { UserRepositoryPort } from './database/user.repository.port'
import { InvitationMailRepositoryPort } from './database/invitationMail.repository.port'
import { CreateInvitationMailReq } from './dto/req/create-invitation-mail.req'
import { ORGANIZATION_REPOSITORY } from '../organization/organization.di-token'
import { OrganizationRepositoryPort } from '../organization/database/organization.repository.port'

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepositoryPort,
    @Inject(INVITATION_MAIL_REPOSITORY) private readonly invitationRepository: InvitationMailRepositoryPort,
    @Inject(ORGANIZATION_REPOSITORY) private readonly organizationRepository: OrganizationRepositoryPort,
  ) {}

  async getUserProfile(userId: string): Promise<UserProp> {
    return await this.userRepository.findOneById(userId)
  }

  async upadteProfile(userId: string, props: Pick<UserProp, 'firstName' | 'lastName'>): Promise<UserProp> {
    return await this.userRepository.update(userId, props)
  }

  async findOneByEmail(email: EmailVO): Promise<UserProp> {
    return await this.userRepository.findOneByEmail(email)
  }

  async findUserIdByEmail(email: EmailVO): Promise<Pick<UserProp, 'id'>> {
    return await this.userRepository.findUserIdByEmail(email)
  }

  async findPasswordByUserId(id: string): Promise<string> {
    return await this.userRepository.findPasswordByUserId(id)
  }

  async insertUser(
    organizationId: string,
    createUserDto: Omit<UserProp, 'id' | 'organizationId'>,
    password: InputPasswordVO,
  ) {
    return await this.userRepository.insertUser(organizationId, createUserDto, password)
  }

  async deleteInvitationMail(code: string): Promise<void> {
    await this.invitationRepository.deleteOne(code)
  }

  async transaction(...args: any[]): Promise<void> {
    return await this.userRepository.transaction(args)
  }

  async findInvitationMail(code: string, email: EmailVO): Promise<InvitationEmailProp> {
    return await this.invitationRepository.findOne(code, email)
  }

  async sendInvitationMail(dto: CreateInvitationMailReq, code: string): Promise<InvitationEmailProp> {
    try {
      const user = await this.userRepository.findOneByEmail(new EmailVO(dto.email))
      // What if organizationId is provided by parameter?
      const organization = await this.organizationRepository.findOneByName(dto.organizationName)
      if (user) throw new ConflictException('User Already Existed')
      return await this.invitationRepository.insertOne({
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
