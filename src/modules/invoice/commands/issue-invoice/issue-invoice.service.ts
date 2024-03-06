/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { ConfigModule } from '@nestjs/config'
import { Inject } from '@nestjs/common'
import { formatDate } from '../../../../libs/utils/formatDate'
import { OrganizationRepositoryPort } from '../../../organization/database/organization.repository.port'
import { ORGANIZATION_REPOSITORY } from '../../../organization/organization.di-token'
import { InvoiceRepositoryPort } from '../../database/invoice.repository.port'
import { INVOICE_REPOSITORY } from '../../invoice.di-token'
import { IssueInvoiceCommand } from './issue-invoice.command'
import { IRFIMail, RFIMailer } from '../../../ordered-job-note/infrastructure/mailer.infrastructure'

ConfigModule.forRoot()

const { EMAIL_USER, EMAIL_PASS } = process.env

@CommandHandler(IssueInvoiceCommand)
export class IssueInvoiceService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(INVOICE_REPOSITORY) private readonly invoiceRepo: InvoiceRepositoryPort, // @ts-ignore
    @Inject(ORGANIZATION_REPOSITORY) private readonly organizationRepo: OrganizationRepositoryPort,
    private readonly mailer: RFIMailer,
  ) {}
  async execute(command: IssueInvoiceCommand): Promise<void> {
    const invoice = await this.invoiceRepo.findOneOrThrow(command.invoiceId)
    const organization = await this.organizationRepo.findOneOrThrow(invoice.clientOrganizationId)

    invoice.issue()
    // TODO: issued_at 필드 추가
    await this.invoiceRepo.update(invoice)

    const input: IRFIMail = {
      subject: `BarunCorp ${formatDate(invoice.getProps().serviceMonth)} Invoice mail`,
      text: `
        subtotal: $${invoice.getProps().subTotal}
        discount: $${invoice.getProps().discount}
        total: $${invoice.total}
      `,
      from: 'automation@baruncorp.com',
      to: [organization.getProps().invoiceRecipientEmail || 'bs_khm@naver.com'],
      threadId: null,
      files: command.files,
    }

    await this.mailer.sendRFI(input)
  }
}
