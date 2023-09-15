import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../database/prisma.service'
import { CreateInvitationMailProp, InvitationEmailProp } from '../domain/invitationMail.types'
import { InvitationMailRepositoryPort } from './invitationMail.repository.port'
import { EmailVO } from '../domain/value-objects/email.vo'
import { InvitationEmails } from '@prisma/client'

@Injectable()
export class InvitationMailRepository implements InvitationMailRepositoryPort {
  constructor(private readonly prismaService: PrismaService) {}

  async deleteOne(code: string): Promise<void> {
    await this.prismaService.invitationEmails.delete({ where: { code } })
  }

  async insertOne(props: CreateInvitationMailProp): Promise<InvitationEmailProp> {
    return await this.prismaService.invitationEmails.create({
      data: props,
    })
  }

  async findOne(code: string, email: EmailVO): Promise<InvitationEmails | null> {
    return await this.prismaService.invitationEmails.findFirst({
      where: {
        code,
        email: email.email,
      },
    })
  }
}
