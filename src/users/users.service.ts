import { Inject, Injectable } from '@nestjs/common'
import { INVITATION_MAIL_REPOSITORY, USER_REPOSITORY } from './user.di-tokens'
import { EmailVO } from './vo/email.vo'
import { InputPasswordVO } from './vo/password.vo'
import { UserProp } from './interfaces/user.interface'
import { InvitationEmailProp } from './interfaces/invitationMail.interface'
import { UserRepositoryPort } from './database/user.repository.port'
import { InvitationMailRepositoryPort } from './database/invitationMail.repository.port'

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepositoryPort,
    @Inject(INVITATION_MAIL_REPOSITORY) private readonly invitationRepository: InvitationMailRepositoryPort,
  ) {}

  async getUserInfo(userId: string): Promise<UserProp> {
    return await this.userRepository.findOneById(userId)
  }

  async upadteUser(userId: string, props: Pick<UserProp, 'firstName' | 'lastName'>): Promise<UserProp> {
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

  async insertUser(companyId: number, createUserDto: Omit<UserProp, 'id' | 'companyId'>, password: InputPasswordVO) {
    return await this.userRepository.insertUser(companyId, createUserDto, password)
  }

  async deleteInvitationMail(code: string): Promise<void> {
    await this.invitationRepository.deleteOne(code)
  }

  async transaction(...args: any[]): Promise<void> {
    return await this.userRepository.transaction(args)
  }

  async findInvitationMail(code: string): Promise<InvitationEmailProp> {
    return await this.invitationRepository.findOne(code)
  }

  async sendInvitationMail(props: InvitationEmailProp): Promise<InvitationEmailProp> {
    return await this.invitationRepository.insertOne(props)
  }
}
