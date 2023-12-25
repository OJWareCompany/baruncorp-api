import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../database/prisma.service'
import { CreateInvitationMailProp, InvitationEmailProp } from '../domain/invitationMail.types'
import { InvitationMailRepositoryPort } from './invitationMail.repository.port'
import { EmailVO } from '../domain/value-objects/email.vo'
import { InvitationEmails } from '@prisma/client'

@Injectable()
export class InvitationMailRepository implements InvitationMailRepositoryPort {
  constructor(private readonly prismaService: PrismaService) {}

  async insertOne(props: CreateInvitationMailProp): Promise<InvitationEmailProp> {
    return await this.prismaService.invitationEmails.create({
      data: {
        email: props.email,
        organizationId: props.organizationId,
        role: props.role,
        updated_at: new Date(),
      },
    })
  }

  async findOne(email: EmailVO): Promise<InvitationEmails | null> {
    return await this.prismaService.invitationEmails.findFirst({
      where: {
        email: email.email,
      },
    })
  }
}
