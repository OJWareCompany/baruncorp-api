/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, Injectable } from '@nestjs/common'
import { UserRepositoryPort } from '../../database/user.repository.port'
import { INVITATION_MAIL_REPOSITORY, USER_REPOSITORY } from '../../user.di-tokens'
import { InvitationMailRepositoryPort } from '../../database/invitationMail.repository.port'
import { UserEntity } from '../user.entity'
import { EmailVO } from '../value-objects/email.vo'
import { UserStatusEnum } from '../user.types'
import { PTO_REPOSITORY } from '../../../pto/pto.di-token'
import { PtoRepositoryPort } from '../../../pto/database/pto.repository.port'

@Injectable()
export class UserManager {
  constructor(
    // @ts-ignore
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryPort, // @ts-ignore
    @Inject(INVITATION_MAIL_REPOSITORY) private readonly invitationRepo: InvitationMailRepositoryPort,
    @Inject(PTO_REPOSITORY) private readonly ptoRepo: PtoRepositoryPort,
  ) {}

  async determineUserStatus(user: UserEntity): Promise<UserStatusEnum> {
    const password = await this.userRepo.findPasswordByUserId(user.id)
    if (password) return UserStatusEnum.ACTIVE
    const invitation = await this.invitationRepo.findOne(new EmailVO(user.getProps().email))
    if (invitation) return UserStatusEnum.INVITATION_SENT
    return UserStatusEnum.INVITATION_NOT_SENT
  }

  async isPto(user: UserEntity): Promise<boolean> {
    return await this.ptoRepo.hasPtoDetailOnToday(user.id)
  }
}
