import { Payments, Prisma } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { Mapper } from '../../libs/ddd/mapper.interface'
import { PaymentResponseDto } from './dtos/payment.response.dto'
import { PaymentMethodEnum } from './domain/payment.type'
import { PaymentEntity } from './domain/payment.entity'

@Injectable()
export class PaymentMapper implements Mapper<PaymentEntity, Payments, PaymentResponseDto> {
  toPersistence(entity: PaymentEntity): Payments {
    const props = entity.getProps()
    const record: Payments = {
      id: props.id,
      invoiceId: props.invoiceId,
      amount: new Prisma.Decimal(props.amount.toFixed(4)),
      paymentMethod: props.paymentMethod,
      paymentDate: props.paymentDate,
      notes: props.notes,
      canceledAt: props.canceledAt,
      createdBy: props.createdBy,
    }
    return record
  }

  toDomain(record: Payments): PaymentEntity {
    const entity = new PaymentEntity({
      id: record.id,
      props: {
        invoiceId: record.invoiceId,
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

  toResponse(entity: PaymentEntity): PaymentResponseDto {
    const props = entity.getProps()
    const response = new PaymentResponseDto({
      id: props.id,
      invoiceId: props.invoiceId,
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
