/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PrismaService } from '../../../database/prisma.service'
import { InvoiceRepositoryPort } from '../../database/invoice.repository.port'
import { InvoiceNotFoundException } from '../../domain/invoice.error'
import { INVOICE_REPOSITORY } from '../../invoice.di-token'
import { IssueInvoiceCommand } from './issue-invoice.command'
import { ConfigModule } from '@nestjs/config'
import nodemailer from 'nodemailer'
import { formatDate } from '../../../../libs/utils/formatDate'
import { OrganizationNotFoundException } from '../../../organization/domain/organization.error'
import { JobRepositoryPort } from '../../../ordered-job/database/job.repository.port'
import { JOB_REPOSITORY } from '../../../ordered-job/job.di-token'

ConfigModule.forRoot()

const { EMAIL_USER, EMAIL_PASS } = process.env

@CommandHandler(IssueInvoiceCommand)
export class IssueInvoiceService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(INVOICE_REPOSITORY) private readonly invoiceRepo: InvoiceRepositoryPort, // @ts-ignore
    @Inject(JOB_REPOSITORY) private readonly jobRepo: JobRepositoryPort,
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

    if (!organization) throw new OrganizationNotFoundException()
    let subtotal = 0
    let total = 0

    await Promise.all(
      jobs.map(async (job) => {
        const eachSubtotal = await this.jobRepo.getSubtotalInvoiceAmount(job.id)
        const eachTotal = await this.jobRepo.getTotalInvoiceAmount(job.id)
        subtotal += eachSubtotal
        total += eachTotal
      }),
    )

    const transporter = nodemailer.createTransport({
      // host: 'smtp.gmail.com',
      host: 'wsmtp.ecounterp.com',
      port: 587,
      secure: false, // upgrade later with STARTTLS
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    })

    const mailOptions = {
      from: EMAIL_USER,
      to: organization.invoiceRecipientEmail || 'bs_khm@naver.com',
      subject: `BarunCorp ${formatDate(invoice.serviceMonth)} Invoice mail`,
      text: `
      subtotal: $${subtotal}
      discount: $${subtotal - total}
      total: $${total}
      `,
      attachments: command.attachments,
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
