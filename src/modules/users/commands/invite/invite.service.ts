/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { ConfigModule } from '@nestjs/config'
import { Inject } from '@nestjs/common'
import { ORGANIZATION_REPOSITORY } from '../../../organization/organization.di-token'
import { OrganizationRepositoryPort } from '../../../organization/database/organization.repository.port'
import { UserRepositoryPort } from '../../database/user.repository.port'
import { EmailVO } from '../../domain/value-objects/email.vo'
import { INVITATION_MAIL_REPOSITORY, USER_REPOSITORY } from '../../user.di-tokens'
import { InvitationMailRepositoryPort } from '../../database/invitationMail.repository.port'
import { InviteCommand } from './invite.command'
import { InvitationEmailResponseDto } from '../../dtos/invitation-email.response.dto'
import { IRFIMail, RFIMailer } from '../../../ordered-job-note/infrastructure/mailer.infrastructure'

ConfigModule.forRoot()

const { EMAIL_USER, EMAIL_PASS, WEB_URL } = process.env

@CommandHandler(InviteCommand)
export class InviteService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryPort,
    // @ts-ignore
    @Inject(ORGANIZATION_REPOSITORY) private readonly organizationRepo: OrganizationRepositoryPort,
    // @ts-ignore
    @Inject(INVITATION_MAIL_REPOSITORY) private readonly invitationMailRepo: InvitationMailRepositoryPort,
    private readonly mailer: RFIMailer,
  ) {}
  async execute(command: InviteCommand): Promise<InvitationEmailResponseDto> {
    const user = await this.userRepo.findUserByEmailOrThrow(new EmailVO(command.email))

    const organization = await this.organizationRepo.findOneOrThrow(command.organizationId)

    await this.invitationMailRepo.insertOne({
      email: command.email,
      role: user.role,
      organizationId: organization.id,
    })

    const input: IRFIMail = {
      subject: 'BarunCorp Invitation Email',
      text: `${WEB_URL}/signup?userId=${user.id}`,
      from: 'automation@baruncorp.com',
      to: [command.email],
      threadId: null,
      files: null,
    }

    await this.mailer.sendRFI(input)

    user.invite()
    await this.userRepo.update(user)

    return {
      email: command.email,
      role: user.role,
      organizationId: organization.id,
      updatedAt: new Date(),
      createdAt: new Date(),
    }
  }
}
