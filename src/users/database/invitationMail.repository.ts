import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../database/prisma.service'
import { InvitationEmailProp } from '../interfaces/invitationMail.interface'
import { InvitationMailRepositoryPort } from './invitationMail.repository.port'

@Injectable()
export class InvitationMailRepository implements InvitationMailRepositoryPort {
  constructor(private readonly prismaService: PrismaService) {}

  async deleteOne(code: string): Promise<void> {
    await this.prismaService.invitationEmail.delete({ where: { code } })
  }

  async insertOne(props: InvitationEmailProp): Promise<InvitationEmailProp> {
    return await this.prismaService.invitationEmail.create({
      data: props,
    })
  }

  async findOne(code: string): Promise<any> {
    return await this.prismaService.invitationEmail.findUnique({
      where: {
        code,
      },
    })
  }
}
