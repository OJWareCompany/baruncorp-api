import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../database/prisma.service'
import { CreateInvitationMailProp, InvitationEmailProp } from '../interfaces/invitationMail.interface'
import { InvitationMailRepositoryPort } from './invitationMail.repository.port'
import { EmailVO } from '../vo/email.vo'

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

  async findOne(code: string, email: EmailVO): Promise<any> {
    return await this.prismaService.invitationEmails.findFirst({
      where: {
        code,
        email: email.email,
      },
    })
  }
}
