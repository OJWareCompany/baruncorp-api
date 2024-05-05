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
import { PrismaService } from '../../../database/prisma.service'
import { OrderModificationHistoryOperationEnum } from '../../../integrated-order-modification-history/domain/integrated-order-modification-history.type'

ConfigModule.forRoot()

const { EMAIL_USER, EMAIL_PASS, APP_MODE } = process.env

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
    invoice.issue()

    await this.prisma.integratedOrderModificationHistory.create({
      data: {
        entity: 'Invoice',
        jobId: invoice.id,
        entityId: invoice.id,
        modifiedAt: new Date(), // 받아와야함
        modifiedBy: 'username: ' + command.issuedBy + ' userId: ' + command.issuedByUserId,
        scopeOrTaskName: invoice.getProps().serviceMonth.toISOString(),
        attribute: 'Issue History',
        operation: OrderModificationHistoryOperationEnum.Update,
        beforeValue: null,
        afterValue: null,
        isDateType: false,
      },
    })

    await this.invoiceRepo.update(invoice)

    // const tieredDiscountField = organization.getProps().isTierDiscount
    //   ? `volume tier discount: $${invoice.getProps().volumeTierDiscount}`
    //   : ''

    const to: string[] =
      APP_MODE === 'production'
        ? [organization.getProps().invoiceRecipientEmail || 'hyomin@oj.vision']
        : ['hyomin@oj.vision', 'sangwon@oj.vision']
    const textForDev = APP_MODE === 'production' ? '' : 'THIS IS FROM DEVELOPMENT SERVER'
    console.log(textForDev)

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
      to: [...to],
      // cc: [],
      threadId: null,
      files: command.files,
    }

    await this.mailer.sendRFI(input)
  }
}
