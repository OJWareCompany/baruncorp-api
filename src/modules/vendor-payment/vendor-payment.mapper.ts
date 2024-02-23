import { VendorPayments, Prisma } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { Mapper } from '../../libs/ddd/mapper.interface'
import { VendorPaymentResponseDto } from './dtos/vendor-payment.response.dto'
import { VendorPaymentEntity } from './domain/vendor-payment.entity'
import { PaymentMethodEnum } from './domain/vendor-payment.type'

@Injectable()
export class VendorPaymentMapper implements Mapper<VendorPaymentEntity, VendorPayments, VendorPaymentResponseDto> {
  toPersistence(entity: VendorPaymentEntity): VendorPayments {
    const props = entity.getProps()
    const record: VendorPayments = {
      id: props.id,
      vendorInvoiceId: props.vendorInvoiceId,
      amount: new Prisma.Decimal(props.amount.toFixed(4)),
      paymentMethod: props.paymentMethod,
      paymentDate: props.paymentDate,
      notes: props.notes,
      canceledAt: props.canceledAt,
      createdBy: props.createdBy,
    }
    return record
  }

  toDomain(record: VendorPayments): VendorPaymentEntity {
    const entity = new VendorPaymentEntity({
      id: record.id,
      props: {
        vendorInvoiceId: record.vendorInvoiceId,
        amount: Number(record.amount),
        paymentMethod: record.paymentMethod as PaymentMethodEnum,
        paymentDate: record.paymentDate,
        notes: record.notes,
        canceledAt: record.canceledAt,
        createdBy: record.id,
      },
    })
    return entity
  }

  toResponse(entity: VendorPaymentEntity): VendorPaymentResponseDto {
    const props = entity.getProps()
    const response = new VendorPaymentResponseDto({
      id: props.id,
      vendorInvoiceId: props.vendorInvoiceId,
      amount: Number(props.amount),
      paymentMethod: props.paymentMethod,
      paymentDate: props.paymentDate.toISOString(),
      notes: props.notes,
      canceledAt: props.canceledAt?.toISOString() || null,
      organizationId: 'TEMP props.invoice.organization.id',
      organizationName: 'TEMP props.invoice.organization.name',
    })
    return response
  }
}
