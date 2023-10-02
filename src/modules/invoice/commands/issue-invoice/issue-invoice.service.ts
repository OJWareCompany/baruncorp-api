/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, NotFoundException } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PrismaService } from '../../../database/prisma.service'
import { InvoiceRepositoryPort } from '../../database/invoice.repository.port'
import { InvoiceNotFoundException } from '../../domain/invoice.error'
import { INVOICE_REPOSITORY } from '../../invoice.di-token'
import { IssueInvoiceCommand } from './issue-invoice.command'
import { ConfigModule } from '@nestjs/config'
import nodemailer from 'nodemailer'

ConfigModule.forRoot()

const { EMAIL_USER, EMAIL_PASS } = process.env

@CommandHandler(IssueInvoiceCommand)
export class IssueInvoiceService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(INVOICE_REPOSITORY)
    private readonly invoiceRepo: InvoiceRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}
  async execute(command: IssueInvoiceCommand): Promise<void> {
    const entity = await this.invoiceRepo.findOne(command.invoiceId)
    if (!entity) throw new InvoiceNotFoundException()
    entity.issue()
    // TODO: issued_at 필드 추가
    await this.invoiceRepo.update(entity)

    const invoice = await this.prismaService.invoices.findUnique({
      where: { id: command.invoiceId },
    })
    if (!invoice) throw new InvoiceNotFoundException()

    const jobs = await this.prismaService.orderedJobs.findMany({
      where: { invoiceId: invoice.id },
      include: {
        orderedServices: {
          include: {
            service: true,
          },
        },
      },
    })

    const organization = await this.prismaService.organizations.findUnique({
      where: { id: invoice.clientOrganizationId },
    })

    let subtotal = 0
    jobs.map((job) => {
      job.orderedServices.map((orderedService) => (subtotal += Number(orderedService.price ?? 0)))
    })

    let total = 0
    jobs.map((job) => {
      job.orderedServices.map(
        (orderedService) => (total += Number((orderedService.priceOverride || orderedService.price) ?? 0)),
      )
    })

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // upgrade later with STARTTLS
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    })

    const mailOptions = {
      from: EMAIL_USER,
      to: organization?.email || 'bs_khm@naver.com',
      subject: 'BarunCorp Invitation Email',
      text: `
      subtotal: $${subtotal}
      discount: $${subtotal - total}
      total: $${total}
      `,
    }

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error)
      } else {
        console.log('Email sent!: ' + info.response)
      }
    })
  }
}
