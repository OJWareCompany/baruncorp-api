import { VendorInvoices } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { Mapper } from '../../libs/ddd/mapper.interface'
import { VendorInvoiceResponseDto } from './dtos/vendor-invoice.response.dto'
import { VendorInvoiceEntity } from './domain/vendor-invoice.entity'
import { Decimal } from '@prisma/client/runtime/library'

@Injectable()
export class VendorInvoiceMapper implements Mapper<VendorInvoiceEntity, VendorInvoices, VendorInvoiceResponseDto> {
  toPersistence(entity: VendorInvoiceEntity): VendorInvoices {
    const props = entity.getProps()
    const record: VendorInvoices = {
      id: props.id,
      organizationId: props.organizationId,
      organizationName: props.organizationName,
      daysPastDue: props.daysPastDue,
      invoiceDate: props.invoiceDate,
      dueDate: props.dueDate,
      invoiceNumber: props.invoiceNumber,
      terms: props.terms,
      note: props.note,
      serviceMonth: props.serviceMonth,
      subTotal: new Decimal(props.subTotal),
      total: new Decimal(props.total),
      invoiceTotalDifference: new Decimal(props.invoiceTotalDifference),
      internalTotalBalanceDue: props.internalTotalBalanceDue ? new Decimal(props.internalTotalBalanceDue) : null,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    }
    return record
  }

  toDomain(record: VendorInvoices): VendorInvoiceEntity {
    const entity = new VendorInvoiceEntity({
      id: record.id,
      props: {
        organizationId: record.organizationId,
        organizationName: record.organizationName,
        daysPastDue: record.daysPastDue,
        invoiceDate: record.invoiceDate,
        dueDate: record.dueDate,
        invoiceNumber: record.invoiceNumber,
        terms: record.terms,
        note: record.note,
        serviceMonth: record.serviceMonth,
        subTotal: Number(record.subTotal),
        total: Number(record.total),
        invoiceTotalDifference: Number(record.invoiceTotalDifference),
        internalTotalBalanceDue: record.internalTotalBalanceDue ? Number(record.internalTotalBalanceDue) : null,
      },
    })
    return entity
  }

  toResponse(entity: VendorInvoiceEntity): VendorInvoiceResponseDto {
    const props = entity.getProps()
    const response = new VendorInvoiceResponseDto()
    response.id = props.id
    response.organizationId = props.organizationId
    response.organizationName = props.organizationName
    response.daysPastDue = props.daysPastDue ? props.daysPastDue.toISOString() : null
    response.invoiceDate = props.invoiceDate.toISOString()
    response.dueDate = props.dueDate ? props.dueDate.toISOString() : null
    response.invoiceNumber = props.invoiceNumber
    response.terms = props.terms
    response.note = props.note
    response.serviceMonth = props.serviceMonth.toISOString()
    response.subTotal = props.subTotal
    response.total = props.total
    response.invoiceTotalDifference = props.invoiceTotalDifference
    response.internalTotalBalanceDue = props.internalTotalBalanceDue
    response.createdAt = props.createdAt.toISOString()
    response.updatedAt = props.updatedAt.toISOString()
    return response
  }
}
