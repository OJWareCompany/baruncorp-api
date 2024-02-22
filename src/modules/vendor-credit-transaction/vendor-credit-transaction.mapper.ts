import { VendorCreditTransactions, Prisma } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { Mapper } from '../../libs/ddd/mapper.interface'
import { VendorCreditTransactionResponseDto } from './dtos/vendor-credit-transaction.response.dto'
import { VendorCreditTransactionTypeEnum } from './domain/vendor-credit-transaction.type'
import { VendorCreditTransactionEntity } from './domain/vendor-credit-transaction.entity'

@Injectable()
export class VendorCreditTransactionMapper
  implements Mapper<VendorCreditTransactionEntity, VendorCreditTransactions, VendorCreditTransactionResponseDto>
{
  toPersistence(entity: VendorCreditTransactionEntity): VendorCreditTransactions {
    const props = entity.getProps()
    const record: VendorCreditTransactions = {
      id: props.id,
      vendorOrganizationId: props.vendorOrganizationId,
      createdBy: props.createdBy,
      amount: new Prisma.Decimal(props.amount.toFixed(4)),
      transactionType: props.creditTransactionType,
      relatedVendorInvoiceId: props.relatedVendorInvoiceId ? props.relatedVendorInvoiceId : null,
      transactionDate: props.transactionDate,
      canceledAt: props.canceledAt,
      createdByUserId: props.createdByUserId,
      note: props.note,
    }
    return record
  }

  toDomain(record: VendorCreditTransactions): VendorCreditTransactionEntity {
    const entity = new VendorCreditTransactionEntity({
      id: record.id,
      props: {
        createdByUserId: record.createdByUserId,
        vendorOrganizationId: record.vendorOrganizationId,
        createdBy: record.createdBy,
        amount: Number(record.amount),
        creditTransactionType: record.transactionType as VendorCreditTransactionTypeEnum,
        relatedVendorInvoiceId: record.relatedVendorInvoiceId,
        transactionDate: record.transactionDate,
        canceledAt: record.canceledAt,
        note: record.note,
      },
    })
    return entity
  }

  toResponse(entity: VendorCreditTransactionEntity): VendorCreditTransactionResponseDto {
    const props = entity.getProps()
    const response = new VendorCreditTransactionResponseDto({
      id: entity.id,
      createdByUserId: props.createdByUserId,
      vendorOrganizationId: props.vendorOrganizationId,
      createdBy: props.createdBy,
      amount: props.amount,
      creditTransactionType: props.creditTransactionType as VendorCreditTransactionTypeEnum,
      relatedVendorInvoiceId: props.relatedVendorInvoiceId ? props.relatedVendorInvoiceId : null,
      transactionDate: props.transactionDate,
      canceledAt: props.canceledAt,
    })
    return response
  }
}
