import { CreditTransactions, Prisma } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { Mapper } from '../../libs/ddd/mapper.interface'
import { CreditTransactionResponseDto } from './dtos/credit-transaction.response.dto'
import { CreditTransactionTypeEnum } from './domain/credit-transaction.type'
import { CreditTransactionEntity } from './domain/credit-transaction.entity'

@Injectable()
export class CreditTransactionMapper
  implements Mapper<CreditTransactionEntity, CreditTransactions, CreditTransactionResponseDto>
{
  toPersistence(entity: CreditTransactionEntity): CreditTransactions {
    const props = entity.getProps()
    const record: CreditTransactions = {
      id: props.id,
      clientOrganizationId: props.clientOrganizationId,
      createdBy: props.createdBy,
      amount: new Prisma.Decimal(props.amount),
      transactionType: props.creditTransactionType,
      relatedInvoiceId: props.relatedInvoiceId ? props.relatedInvoiceId : null,
      transactionDate: props.transactionDate,
      canceledAt: props.canceledAt,
      createdByUserId: props.createdByUserId,
      note: props.note,
    }
    return record
  }

  toDomain(record: CreditTransactions): CreditTransactionEntity {
    const entity = new CreditTransactionEntity({
      id: record.id,
      props: {
        createdByUserId: record.createdByUserId,
        clientOrganizationId: record.clientOrganizationId,
        createdBy: record.createdBy,
        amount: Number(record.amount),
        creditTransactionType: record.transactionType as CreditTransactionTypeEnum,
        relatedInvoiceId: record.relatedInvoiceId,
        transactionDate: record.transactionDate,
        canceledAt: record.canceledAt,
        note: record.note,
      },
    })
    return entity
  }

  toResponse(entity: CreditTransactionEntity): CreditTransactionResponseDto {
    const props = entity.getProps()
    const response = new CreditTransactionResponseDto({
      id: entity.id,
      createdByUserId: props.createdByUserId,
      clientOrganizationId: props.clientOrganizationId,
      createdBy: props.createdBy,
      amount: props.amount,
      creditTransactionType: props.creditTransactionType as CreditTransactionTypeEnum,
      relatedInvoiceId: props.relatedInvoiceId ? props.relatedInvoiceId : null,
      transactionDate: props.transactionDate,
      canceledAt: props.canceledAt,
    })
    return response
  }
}
