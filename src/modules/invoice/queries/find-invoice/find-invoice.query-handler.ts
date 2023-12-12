import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Invoices, Organizations } from '@prisma/client'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { PrismaService } from '../../../database/prisma.service'
import { JobMapper } from '../../../ordered-job/job.mapper'
import { JobEntity } from '../../../ordered-job/domain/job.entity'
import { InvoiceResponseDto, LineItem, PricingType, TaskSizeEnum } from '../../dtos/invoice.response.dto'
import { MountingTypeEnum, ProjectPropertyTypeEnum } from '../../../project/domain/project.type'
import { PaymentMethodEnum } from '../../../payment/domain/payment.type'
import { InvoiceNotFoundException } from '../../domain/invoice.error'
import { OrderedServiceSizeForRevisionEnum } from '../../../ordered-service/domain/ordered-service.type'
import { formatDate, formatDateWithTime } from '../../../../libs/utils/formatDate'

export class FindInvoiceQuery {
  readonly invoiceId: string
  constructor(props: FindInvoiceQuery) {
    initialize(this, props)
  }
}

export type FindInvoidReturnType = Invoices & { organization: Organizations; jobs: JobEntity[] }
@QueryHandler(FindInvoiceQuery)
export class FindInvoiceQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService, private readonly jobMapper: JobMapper) {}

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
    const lineItems: LineItem[] = await Promise.all(
      jobs.map(async (job) => {
        // 이거 뭐냐.
        let subtotal = 0
        job.orderedServices.map((orderedService) => (subtotal += Number(orderedService.service.basePrice ?? 0)))
        let total = 0
        job.orderedServices.map(
          (orderedService) => (total += Number((orderedService.priceOverride || orderedService.price) ?? 0)),
        )

        const isContainsRevisionTask = job.orderedServices.find((orderedService) => orderedService.isRevision)

        const project = await this.prismaService.orderedProjects.findUnique({ where: { id: job.projectId } })

        let stateName = 'unknown'
        if (project?.stateId) {
          const ahjnote = await this.prismaService.aHJNotes.findFirst({ where: { geoId: project.stateId } })
          stateName = ahjnote?.name || 'unknown'
        }

        return {
          jobId: job.id,
          jobRequestNumber: job.jobRequestNumber,
          description: job.jobName,
          dateSentToClient: job.updatedAt,
          mountingType: job.mountingType as MountingTypeEnum,
          clientOrganization: {
            id: job.clientOrganizationId,
            name: job.clientOrganizationName,
          },
          propertyType: job.projectType as ProjectPropertyTypeEnum,
          billingCodes: job.orderedServices.map((orderedService) => orderedService.service.billingCode),
          price: total,
          taskSubtotal: subtotal,

          // totalJobPriceOverride: null, // TODO: job필드 추가? -> X Job의 Service 가격을 수정하는 방식으로.
          state: stateName,
          isContainsRevisionTask: !!isContainsRevisionTask,
          taskSizeForRevision: job.revisionSize as TaskSizeEnum | null, // 컬럼 추가, 프로젝트 Aggregate를 만든다고 될 일이 아님
          pricingType: job.pricingType as PricingType, // TODO: 조직별 할인 작업 들어가야 할 수 있음
        }
      }),
    )

    return {
      id: invoice.id,
      invoiceName: organization
        ? organization.name + ' ' + formatDate(invoice.serviceMonth)
        : formatDate(invoice.serviceMonth),
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
