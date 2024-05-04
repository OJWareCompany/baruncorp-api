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

const { EMAIL_USER, EMAIL_PASS } = process.env

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

    const tieredDiscountField = organization.getProps().isTierDiscount
      ? `volume tier discount: $${invoice.getProps().volumeTierDiscount}`
      : ''

    const input: IRFIMail = {
      subject: `BarunCorp ${formatDate(invoice.getProps().serviceMonth)} Invoice mail`,
      text: `
        subtotal: $${invoice.getProps().subTotal}
        ${tieredDiscountField}
        balance due: $${invoice.getProps().balanceDue}
      `,
      from: 'automation@baruncorp.com',
      to: [organization.getProps().invoiceRecipientEmail || 'bs_khm@naver.com'],
      // cc: [],
      threadId: null,
      files: command.files,
    }

    await this.mailer.sendRFI(input)
  }
}
