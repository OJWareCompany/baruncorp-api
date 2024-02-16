/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { ConfigModule } from '@nestjs/config'
import { Inject } from '@nestjs/common'
import nodemailer from 'nodemailer'
import { formatDate } from '../../../../libs/utils/formatDate'
import { OrganizationRepositoryPort } from '../../../organization/database/organization.repository.port'
import { ORGANIZATION_REPOSITORY } from '../../../organization/organization.di-token'
import { InvoiceRepositoryPort } from '../../database/invoice.repository.port'
import { INVOICE_REPOSITORY } from '../../invoice.di-token'
import { IssueInvoiceCommand } from './issue-invoice.command'

ConfigModule.forRoot()

const { EMAIL_USER, EMAIL_PASS } = process.env

@CommandHandler(IssueInvoiceCommand)
export class IssueInvoiceService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(INVOICE_REPOSITORY) private readonly invoiceRepo: InvoiceRepositoryPort, // @ts-ignore
    @Inject(ORGANIZATION_REPOSITORY) private readonly organizationRepo: OrganizationRepositoryPort,
  ) {}
  async execute(command: IssueInvoiceCommand): Promise<void> {
    const invoice = await this.invoiceRepo.findOneOrThrow(command.invoiceId)
    const organization = await this.organizationRepo.findOneOrThrow(invoice.clientOrganizationId)

    invoice.issue()
    // TODO: issued_at 필드 추가
    await this.invoiceRepo.update(invoice)

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
      to: organization.getProps().invoiceRecipientEmail || 'bs_khm@naver.com',
      subject: `BarunCorp ${formatDate(invoice.getProps().serviceMonth)} Invoice mail`,
      text: `
      subtotal: $${invoice.getProps().subTotal}
      discount: $${invoice.getProps().discount}
      total: $${invoice.total}
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
