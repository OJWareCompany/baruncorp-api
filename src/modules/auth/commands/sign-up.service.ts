/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { SignUpCommand } from './sign-up.command'
import { Inject } from '@nestjs/common'
import { INVITATION_MAIL_REPOSITORY, USER_REPOSITORY } from '../../users/user.di-tokens'
import { UserRepositoryPort } from '../../users/database/user.repository.port'
import { ORGANIZATION_REPOSITORY } from '../../organization/organization.di-token'
import { OrganizationRepositoryPort } from '../../organization/database/organization.repository.port'
import { InvitationMailRepositoryPort } from '../../users/database/invitationMail.repository.port'
import { EmailVO } from '../../users/domain/value-objects/email.vo'
import { InvitationNotFoundException } from '../../users/user.error'
import { UserName } from '../../users/domain/value-objects/user-name.vo'
import { Phone } from '../../users/domain/value-objects/phone-number.value-object'
import { InputPasswordVO } from '../../users/domain/value-objects/password.vo'

@CommandHandler(SignUpCommand)
export class SignUpService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryPort,
    // @ts-ignore
    @Inject(ORGANIZATION_REPOSITORY) private readonly organizationRepo: OrganizationRepositoryPort,
    // @ts-ignore
    @Inject(INVITATION_MAIL_REPOSITORY) private readonly invitationEmailRepo: InvitationMailRepositoryPort,
  ) {}

  async execute(command: SignUpCommand): Promise<void> {
    const invitationMail = await this.invitationEmailRepo.findOne(new EmailVO(command.email))
    if (!invitationMail) throw new InvitationNotFoundException()
    await this.organizationRepo.findOneOrThrow(invitationMail.organizationId)

    const user = await this.userRepo.findOneByIdOrThrow(command.userId)

    const phoneNumber = command.phoneNumber ? new Phone({ number: command.phoneNumber }) : null

    user.signUp(
      new UserName({
        firstName: command.firstName,
        lastName: command.lastName,
      }),
      phoneNumber,
      command.deliverablesEmails,
    )

    await this.userRepo.update(user)
    await this.userRepo.insertUserPassword(user, new InputPasswordVO(command.password))
  }
}
