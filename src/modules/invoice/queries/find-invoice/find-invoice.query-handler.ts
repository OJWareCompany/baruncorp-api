import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Invoices, Organizations } from '@prisma/client'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { PrismaService } from '../../../database/prisma.service'
import { JobEntity } from '../../../ordered-job/domain/job.entity'
import { InvoiceResponseDto } from '../../dtos/invoice.response.dto'
import { PaymentMethodEnum } from '../../../payment/domain/payment.type'
import { InvoiceNotFoundException } from '../../domain/invoice.error'
import { formatDateWithTime } from '../../../../libs/utils/formatDate'
import { JobResponseMapper } from '../../../ordered-job/job.response.mapper'
import { JobResponseDto } from '../../../ordered-job/dtos/job.response.dto'

export class FindInvoiceQuery {
  readonly invoiceId: string
  constructor(props: FindInvoiceQuery) {
    initialize(this, props)
  }
}

export type FindInvoiceReturnType = Invoices & { organization: Organizations; jobs: JobEntity[] }
@QueryHandler(FindInvoiceQuery)
export class FindInvoiceQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService, private readonly jobResponseMapper: JobResponseMapper) {}

  async execute(query: FindInvoiceQuery): Promise<InvoiceResponseDto> {
    const invoice = await this.prismaService.invoices.findUnique({
      where: { id: query.invoiceId },
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
      orderBy: {
        createdAt: 'desc',
      },
    })

    const organization = await this.prismaService.organizations.findUnique({
      where: { id: invoice.clientOrganizationId },
    })

    const payments = await this.prismaService.payments.findMany({
      where: { invoiceId: invoice.id, canceledAt: null },
      orderBy: { paymentDate: 'desc' },
    })

    const paymentsWithCanceled = await this.prismaService.payments.findMany({
      where: { invoiceId: invoice.id },
      orderBy: { paymentDate: 'desc' },
    })

    // TODO: 조회에서 단순 조회가 아닌 계산 로직이 생긴다. 이게 맞나
    const lineItems: JobResponseDto[] = await Promise.all(
      jobs.map(async (job) => {
        return await this.jobResponseMapper.toResponse(job)
      }),
    )

    return {
      id: invoice.id,
      // invoiceName: organization
      //   ? organization.name + ' ' + formatDate(invoice.serviceMonth)
      //   : formatDate(invoice.serviceMonth),
      status: invoice.status,
      invoiceDate: invoice.invoiceDate.toISOString(),
      terms: invoice.terms,
      dueDate: invoice.dueDate!.toISOString(),
      notesToClient: invoice.notesToClient,
      createdAt: invoice.createdAt.toISOString(),
      updatedAt: invoice.updatedAt.toISOString(),
      servicePeriodDate: invoice.serviceMonth.toISOString(),
      subtotal: Number(invoice.subTotal),
      discount: Number(invoice.discount),
      total: Number(invoice.total),
      clientOrganization: {
        id: invoice.clientOrganizationId,
        name: invoice.organizationName,
      },
      lineItems: lineItems,
      payments: paymentsWithCanceled.map((payment) => {
        // const user = await this.prismaService.users.findUnique({ where: { id: payment.createdBy } })
        return {
          ...payment,
          paymentName: organization
            ? organization.name + ' ' + formatDateWithTime(payment.paymentDate)
            : formatDateWithTime(payment.paymentDate),
          amount: Number(payment.amount),
          paymentMethod: PaymentMethodEnum[payment.paymentMethod],
          paymentDate: payment.paymentDate.toISOString(),
          canceledAt: payment.canceledAt?.toISOString() || null,
          createdByUserId: payment.createdBy,
          createdByUserName: payment.createdBy,
        }
      }),
      totalOfPayment: payments.reduce((pre, cur) => pre + Number(cur.amount), 0),
    }
  }
}

/**
 * total,등의 계산해야하는 필드는 컬럼으로 만들고
 * 관련 데이터가 update될때만 로직을 돌리도록 수정하기.
 */
