import { Payments, Prisma } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { Mapper } from '../../libs/ddd/mapper.interface'
import { PaymentResponseDto } from './dtos/payment.response.dto'
import { PaymentEntity } from './domain/payment.entity'
import { PaymentMethodEnum } from './domain/payment.type'

@Injectable()
export class PaymentMapper implements Mapper<PaymentEntity, Payments, PaymentResponseDto> {
  toPersistence(entity: PaymentEntity): Payments {
    const props = entity.getProps()
    const record: Payments = {
      id: props.id,
      invoiceId: props.invoiceId,
      amount: new Prisma.Decimal(props.amount),
      paymentMethod: props.paymentMethod,
      paymentDate: props.paymentDate,
      notes: props.notes,
      canceledAt: props.canceledAt,
    }
    return record
  }

  toDomain(record: Payments): PaymentEntity {
    const entity = new PaymentEntity({
      id: record.id,
      props: {
        invoiceId: record.invoiceId,
        amount: Number(record.amount),
        paymentMethod: PaymentMethodEnum[record.paymentMethod],
        paymentDate: record.paymentDate,
        notes: record.notes,
        canceledAt: record.canceledAt,
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
    })
    return response
  }
}
