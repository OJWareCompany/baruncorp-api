import { Invoices, Prisma } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { Mapper } from '../../libs/ddd/mapper.interface'
import { InvoiceResponseDto } from './dtos/invoice.response.dto'
import { InvoiceEntity } from './domain/invoice.entity'
import { InvoiceStatusEnum } from './domain/invoice.type'

@Injectable()
export class InvoiceMapper implements Mapper<InvoiceEntity, Invoices, InvoiceResponseDto> {
  toPersistence(entity: InvoiceEntity): Invoices {
    const props = entity.getProps()
    const record: Invoices = {
      id: props.id,
      status: props.status,
      invoiceDate: props.invoiceDate,
      terms: props.terms,
      dueDate: null, // DB에서 자동 계산
      notesToClient: props.notesToClient,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
      clientOrganizationId: props.clientOrganizationId,
      organizationName: props.organizationName,
      serviceMonth: props.serviceMonth,
      subTotal: new Prisma.Decimal(props.subTotal),
      discount: new Prisma.Decimal(props.discount),
      total: new Prisma.Decimal(props.total),
    }
    return record
  }

  toDomain(record: Invoices): InvoiceEntity {
    const entity = new InvoiceEntity({
      id: record.id,
      createdAt: record.createdAt!,
      updatedAt: record.updatedAt!,
      props: {
        status: InvoiceStatusEnum[record.status],
        invoiceDate: record.invoiceDate,
        terms: record.terms,
        dueDate: record.dueDate!,
        notesToClient: record.notesToClient,
        clientOrganizationId: record.clientOrganizationId,
        organizationName: record.organizationName,
        serviceMonth: record.serviceMonth,
        subTotal: Number(record.subTotal),
        discount: Number(record.discount),
        total: Number(record.total),
        payments: [], //records.payments,
      },
    })
    return entity
  }

  toResponse(entity: InvoiceEntity): InvoiceResponseDto {
    const props = entity.getProps()
    const response = new InvoiceResponseDto({
      id: props.id,
      status: props.status,
      invoiceDate: props.invoiceDate.toISOString(),
      terms: props.terms,
      dueDate: props.dueDate.toISOString(),
      notesToClient: props.notesToClient,
      createdAt: props.createdAt.toISOString(),
      updatedAt: props.updatedAt.toISOString(),
      servicePeriodDate: props.serviceMonth.toISOString(),
      subtotal: 1,
      discount: 1,
      total: 1,
      clientOrganization: {
        id: entity.getProps().clientOrganizationId,
        name: '',
      },
      lineItems: [],
      payments: [],
      totalOfPayment: 0,
    })
    return response
  }
}
