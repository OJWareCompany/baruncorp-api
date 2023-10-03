import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Invoices, Organizations } from '@prisma/client'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { PrismaService } from '../../../database/prisma.service'
import { JobMapper } from '../../../ordered-job/job.mapper'
import { JobEntity } from '../../../ordered-job/domain/job.entity'
import { InvoiceResponseDto, LineItem, TaskSizeEnum } from '../../dtos/invoice.response.dto'
import { MountingTypeEnum, ProjectPropertyTypeEnum } from '../../../project/domain/project.type'
import { PaymentMethodEnum } from '../../../payment/domain/payment.type'
import { InvoiceNotFoundException } from '../../domain/invoice.error'
import { OrderedServiceSizeForRevisionEnum } from '../../../ordered-service/domain/ordered-service.type'

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
    })

    const payments = await this.prismaService.payments.findMany({ where: { invoiceId: invoice.id, canceledAt: null } })

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

    const discountAmount = subtotal - total

    // TODO: 조회에서 단순 조회가 아닌 계산 로직이 생긴다. 이게 맞나
    const lineItems: LineItem[] = await Promise.all(
      jobs.map(async (job) => {
        let subtotal = 0
        job.orderedServices.map((orderedService) => (subtotal += Number(orderedService.price ?? 0)))
        let total = 0
        job.orderedServices.map(
          (orderedService) => (total += Number((orderedService.priceOverride || orderedService.price) ?? 0)),
        )

        const isContainsRevisionTask = job.orderedServices.find((orderedService) => orderedService.isRevision)

        const sizeForRevision = job.orderedServices.find(
          (orderedService) =>
            orderedService.isRevision && orderedService.sizeForRevision === OrderedServiceSizeForRevisionEnum.Major,
        )
          ? TaskSizeEnum.Major
          : job.orderedServices.find(
              (orderedService) =>
                orderedService.isRevision && orderedService.sizeForRevision === OrderedServiceSizeForRevisionEnum.Minor,
            )
          ? TaskSizeEnum.Minor
          : null

        const project = await this.prismaService.orderedProjects.findUnique({ where: { id: job.projectId } })

        let stateName = 'unknown'
        if (project?.stateId) {
          const ahjnote = await this.prismaService.aHJNotes.findFirst({ where: { geoId: project.stateId } })
          stateName = ahjnote?.name || 'unknown'
        }

        return {
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
          containsRevisionTask: !!isContainsRevisionTask,
          taskSizeForRevision: sizeForRevision,
          pricingType: 'Standard', // TODO: 조직별 할인 작업 들어가야 할 수 있음
        }
      }),
    )

    return {
      id: invoice.id,
      status: invoice.status,
      invoiceDate: invoice.invoiceDate.toISOString(),
      terms: invoice.terms,
      dueDate: invoice.dueDate!.toISOString(),
      notesToClient: invoice.notesToClient,
      createdAt: invoice.createdAt.toISOString(),
      updatedAt: invoice.updatedAt.toISOString(),
      servicePeriodDate: invoice.serviceMonth.toISOString(),
      subtotal: subtotal,
      discount: discountAmount,
      total: total,
      clientOrganization: {
        id: jobs[0].clientOrganizationId,
        name: jobs[0].clientOrganizationName,
      },
      lineItems: lineItems,
      payments: payments.map((payment) => ({
        ...payment,
        amount: Number(payment.amount),
        paymentMethod: PaymentMethodEnum[payment.paymentMethod],
        paymentDate: payment.paymentDate.toISOString(),
        canceledAt: payment.canceledAt?.toISOString() || null,
      })),
      totalOfPayment: payments.reduce((pre, cur) => pre + Number(cur.amount), 0),
    }
  }
}
