/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, NotFoundException } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { VendorInvoices } from '@prisma/client'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { PrismaService } from '../../../database/prisma.service'
import { VendorInvoiceResponseDto } from '../../dtos/vendor-invoice.response.dto'
import { VENDOR_INVOICE_REPOSITORY } from '../../vendor-invoice.di-token'
import { VendorInvoiceRepositoryPort } from '../../database/vendor-invoice.repository.port'
import { VendorInvoiceMapper } from '../../vendor-invoice.mapper'
import { VendorInvoiceNotFoundException } from '../../domain/vendor-invoice.error'
import { VendorInvoicePayment } from '../../dtos/vendor-invoice.response.dto'
import { VendorInvoicePaymentType } from '../../../vendor-payment/domain/vendor-payment.type'
import { formatDateWithTime } from '../../../../libs/utils/formatDate'

export class FindVendorInvoiceQuery {
  readonly vendorInvoiceId: string
  constructor(props: FindVendorInvoiceQuery) {
    initialize(this, props)
  }
}

@QueryHandler(FindVendorInvoiceQuery)
export class FindVendorInvoiceQueryHandler implements IQueryHandler {
  constructor(
    private readonly prismaService: PrismaService,
    // @ts-ignore
    @Inject(VENDOR_INVOICE_REPOSITORY) private readonly vendorInvoiceRepo: VendorInvoiceRepositoryPort,
    private readonly mapper: VendorInvoiceMapper,
  ) {}

  async execute(query: FindVendorInvoiceQuery): Promise<VendorInvoiceResponseDto> {
    const result = await this.vendorInvoiceRepo.findOne(query.vendorInvoiceId)
    if (!result) throw new VendorInvoiceNotFoundException()

    const organization = await this.prismaService.organizations.findFirst({
      where: { id: result.vendorOrganizationId },
    })
    const payments = await this.prismaService.vendorPayments.findMany({
      where: { vendorInvoiceId: result.id },
    })
    const creditTransactions = await this.prismaService.vendorCreditTransactions.findMany({
      where: { relatedVendorInvoiceId: result.id },
    })

    const vendorPayments: VendorInvoicePayment[] = [
      ...payments.map(
        (payment) =>
          new VendorInvoicePayment({
            id: payment.id,
            paymentName: organization
              ? organization.name + ' ' + formatDateWithTime(payment.paymentDate)
              : formatDateWithTime(payment.paymentDate),
            vendorInvoiceId: payment.vendorInvoiceId,
            amount: Number(payment.amount),
            paymentMethod: payment.paymentMethod as VendorInvoicePaymentType,
            notes: payment.notes,
            paymentDate: payment.paymentDate,
            canceledAt: payment.canceledAt,
          }),
      ),
      ...creditTransactions.map(
        (credit) =>
          new VendorInvoicePayment({
            id: credit.id,
            paymentName: organization
              ? organization.name + ' ' + formatDateWithTime(credit.transactionDate)
              : formatDateWithTime(credit.transactionDate),
            vendorInvoiceId: credit.relatedVendorInvoiceId!,
            amount: Number(credit.amount),
            paymentMethod: credit.transactionType as VendorInvoicePaymentType,
            notes: credit.note,
            paymentDate: credit.transactionDate,
            canceledAt: credit.canceledAt,
          }),
      ),
    ]
    return this.mapper.toResponse(result, vendorPayments)
  }
}
