/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { ConfigModule } from '@nestjs/config'
import { Inject } from '@nestjs/common'
import { formatDate } from '../../../../libs/utils/formatDate'
import { OrganizationRepositoryPort } from '../../../organization/database/organization.repository.port'
import { ORGANIZATION_REPOSITORY } from '../../../organization/organization.di-token'
import { IRFIMail, RFIMailer } from '../../../ordered-job-note/infrastructure/mailer.infrastructure'
import { PrismaService } from '../../../database/prisma.service'
import { EmailVO } from '../../../users/domain/value-objects/email.vo'
import { InvoiceRecipientEmail } from '../../domain/value-objects/invoice-recipient-email.value-object'
import { InvoiceRepositoryPort } from '../../database/invoice.repository.port'
import { INVOICE_REPOSITORY } from '../../invoice.di-token'
import { IssuedByUserName } from '../../domain/value-objects/issued-by-user-name.value-object'
import { IssuedByUserId } from '../../domain/value-objects/issued-by-user-id.value-object'
import { IssueInvoiceCommand } from './issue-invoice.command'
import * as _ from 'lodash'

ConfigModule.forRoot()

const { APP_MODE } = process.env

@CommandHandler(IssueInvoiceCommand)
export class IssueInvoiceService implements ICommandHandler {
  constructor(
    // @ts-ignore
    private readonly prisma: PrismaService, // @ts-ignore
    @Inject(INVOICE_REPOSITORY) private readonly invoiceRepo: InvoiceRepositoryPort, // @ts-ignore
    @Inject(ORGANIZATION_REPOSITORY) private readonly organizationRepo: OrganizationRepositoryPort,
    private readonly mailer: RFIMailer,
  ) {}
  async execute(command: IssueInvoiceCommand): Promise<void> {
    const invoice = await this.invoiceRepo.findOneOrThrow(command.invoiceId)
    const organization = await this.organizationRepo.findOneOrThrow(invoice.clientOrganizationId)

    invoice.issue(
      new InvoiceRecipientEmail({ value: organization.invoiceRecipientEmail! }),
      command.cc?.map((email) => new EmailVO(email)) || [],
      new IssuedByUserId({ value: command.issuedByUserId }),
      new IssuedByUserName({ value: command.issuedByUserName }),
    )

    await this.invoiceRepo.update(invoice)

    // TODO: Refactor
    const to: string[] = // 이것도 VO에 셋팅되어야할듯
      APP_MODE === 'production'
        ? [organization.getProps().invoiceRecipientEmail || 'hyomin@oj.vision']
        : ['hyomin@oj.vision', 'sangwon@oj.vision']
    const textForDev = APP_MODE === 'production' ? '' : 'THIS IS FROM DEVELOPMENT SERVER'

    const input: IRFIMail = {
      subject: `BarunCorp ${formatDate(invoice.getProps().serviceMonth)} Invoice mail`,
      text: `
        ${textForDev}
        Dear ${organization.name},
        <br>
        <br>
        Please find your attached invoice for payment, and let us know if you have any questions or concerns. 
        <br>
        <br>
        We will provide bank details upon request.
        <br>
        <br>
        Thank you for your business!
        <br>
        <br>
        Kind regards,
        <br>
        <br>
        Esther Kim [Payroll Manager]
        <br>
        estherk@baruncorp.com
        <br>
        (610) 504-2657
        <br>
        baruncorp.com
      `,
      from: 'automation@baruncorp.com',
      to: [...to], // TODO: to도 인보이스 엔티티에 있어야할것 같은 느낌
      cc: invoice.currentCc.map((cc) => cc.email),
      threadId: null,
      files: command.files || null,
    }

    await this.mailer.sendRFI(input)
  }
}
