import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { CreateInvoiceProps, InvoiceProps, InvoiceStatusEnum, InvoiceTermsEnum } from './invoice.type'
import addDays from 'date-fns/addDays'
import { InvoiceCreatedDomainEvent } from './domain-events/invoice-created.domain-event'
import { InvoiceCalculator } from './domain-services/invoice-calculator.domain-service'
import { InvoiceEditException } from './invoice.error'
import { InvoiceIssueHistory } from './value-objects/invoice-issue-history.value-object'
import { IssuedByUserId } from './value-objects/issued-by-user-id.value-object'
import { IssuedByUserName } from './value-objects/issued-by-user-name.value-object'
import { EmailVO } from '../../users/domain/value-objects/email.vo'
import { InvoiceRecipientEmail } from './value-objects/invoice-recipient-email.value-object'
import { ConfigModule } from '@nestjs/config'

ConfigModule.forRoot()

const { APP_MODE } = process.env

export class InvoiceEntity extends AggregateRoot<InvoiceProps> {
  protected _id: string

  static create(create: CreateInvoiceProps) {
    const id = v4()
    const total = create.subTotal - create.volumeTierDiscount
    const props: InvoiceProps = {
      ...create,
      total: total,
      balanceDue: total,
      dueDate: addDays(create.invoiceDate, create.terms),
      status: InvoiceStatusEnum.Unissued,
      paymentTotal: 0,
      payments: [],
      amountPaid: 0,
      appliedCredit: 0,
      issuedAt: null,
      currentCc: [],
      invoiceIssueHistories: [],
    }

    const entity = new InvoiceEntity({ id, props })

    entity.addEvent(
      new InvoiceCreatedDomainEvent({
        aggregateId: entity.id,
        clientOrganizationId: entity.props.clientOrganizationId,
        serviceMonth: entity.props.serviceMonth,
      }),
    )

    return entity
  }

  get isIssuedOrPaid() {
    return this.props.status === InvoiceStatusEnum.Issued || this.props.status === InvoiceStatusEnum.Paid
  }

  get status() {
    return this.props.status
  }

  get clientOrganizationId() {
    return this.props.clientOrganizationId
  }

  get total(): number {
    return this.props.total
  }

  get subtotal(): number {
    return this.props.subTotal
  }

  get currentCc(): EmailVO[] {
    const currentCc =
      APP_MODE === 'production'
        ? this.props.currentCc
        : this.props.currentCc.filter((cc) => cc.email.endsWith('oj.vision'))
    return currentCc
  }

  async determinePaymentTotalAndStatus(invoiceCalculator: InvoiceCalculator) {
    this.props.amountPaid = await invoiceCalculator.calcAmountPaid(this)
    this.props.appliedCredit = await invoiceCalculator.calcAppliedCredit(this)
    this.props.paymentTotal = await invoiceCalculator.calcPaymentTotal(this)
    this.props.balanceDue = this.props.total - this.props.paymentTotal

    if (this.props.status === InvoiceStatusEnum.Unissued) return this

    if (this.props.paymentTotal >= this.props.total) {
      this.props.status = InvoiceStatusEnum.Paid
    } else {
      this.props.status = InvoiceStatusEnum.Issued
    }
    return this
  }

  async updatePrices(totalTaskPrice: number, volumeTierDiscount: number, invoiceCalculator: InvoiceCalculator) {
    this.props.subTotal = totalTaskPrice + volumeTierDiscount
    this.props.volumeTierDiscount = volumeTierDiscount
    this.props.total = this.props.subTotal - volumeTierDiscount
    await this.determinePaymentTotalAndStatus(invoiceCalculator)
    return this
  }

  issue(
    to: InvoiceRecipientEmail,
    cc: EmailVO[],
    issuedByUserId: IssuedByUserId,
    issuedByUserName: IssuedByUserName,
  ): this {
    this.props.status = InvoiceStatusEnum.Issued
    if (this.total <= 0) this.props.status = InvoiceStatusEnum.Paid
    this.props.issuedAt = new Date()
    this.props.currentCc = cc

    const invoiceIssueHistory = new InvoiceIssueHistory({
      invoiceId: this.id,
      issuedAt: this.props.issuedAt,
      issuedByUserId: issuedByUserId,
      issuedByUserName: issuedByUserName,
      to: to,
      cc: cc,
    })

    this.props.invoiceIssueHistories.push(invoiceIssueHistory)
    return this
  }

  modifyPeriodMonth(subTotal: number, volumeTierDiscount: number, serviceMonth: Date) {
    if (this.props.status === InvoiceStatusEnum.Paid) {
      throw new InvoiceEditException()
    }
    this.props.subTotal = subTotal
    this.props.volumeTierDiscount = volumeTierDiscount
    this.props.total = subTotal - volumeTierDiscount
    this.props.balanceDue = subTotal - volumeTierDiscount
    this.props.serviceMonth = serviceMonth
  }

  setInvoiceDate(invoiceDate: Date) {
    this.props.invoiceDate = invoiceDate
    this.props.dueDate = addDays(invoiceDate, this.props.terms)
    return this
  }

  setTerms(terms: InvoiceTermsEnum): this {
    this.props.terms = terms
    this.props.dueDate = addDays(this.props.invoiceDate, terms)
    return this
  }

  setNote(notesToClient: string | null): this {
    this.props.notesToClient = notesToClient
    return this
  }

  public validate(): void {
    return
  }
}
