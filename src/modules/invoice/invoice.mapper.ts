import { Invoices, Prisma } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { Mapper } from '../../libs/ddd/mapper.interface'
import { InvoiceResponseDto } from './dtos/invoice.response.dto'
import { InvoiceStatusEnum } from './domain/invoice.type'
import { InvoiceEntity } from './domain/invoice.entity'
import { Decimal } from '@prisma/client/runtime/library'
import { InvoiceModel } from './database/invoice.repository'
import { InvoiceIssueHistory } from './domain/value-objects/invoice-issue-history.value-object'
import { InvoiceRecipientEmail } from './domain/value-objects/invoice-recipient-email.value-object'
import { EmailVO } from '../users/domain/value-objects/email.vo'
import { IssuedByUserId } from './domain/value-objects/issued-by-user-id.value-object'
import { IssuedByUserName } from './domain/value-objects/issued-by-user-name.value-object'

@Injectable()
export class InvoiceMapper implements Mapper<InvoiceEntity, InvoiceModel, InvoiceResponseDto> {
  toPersistence(entity: InvoiceEntity): InvoiceModel {
    const props = entity.getProps()
    const record: InvoiceModel = {
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
      subTotal: new Prisma.Decimal(props.subTotal.toFixed(4)),
      volumeTierDiscount: new Prisma.Decimal(props.volumeTierDiscount.toFixed(4)),
      total: new Prisma.Decimal(props.total.toFixed(4)),
      balanceDue: new Prisma.Decimal(props.balanceDue.toFixed(4)),
      paymentTotal: new Prisma.Decimal(props.paymentTotal.toFixed(4)),
      issuedAt: props.issuedAt,
      amountPaid: new Decimal(props.amountPaid),
      appliedCredit: new Decimal(props.appliedCredit),
      currentCc: props.currentCc.map((cc) => cc.email).toString(),
      invoiceIssueHistories: props.invoiceIssueHistories.map((history) => {
        return {
          invoiceId: history.invoiceId,
          to: history.to.value,
          cc: history.cc.map((cc) => cc.email).toString(),
          issuedAt: history.issuedAt,
          issuedByUserId: history.issuedByUserId.value,
          issuedByUserName: history.issuedByUserName.value,
        }
      }),
    }

    return record
  }

  toDomain(record: InvoiceModel): InvoiceEntity {
    const entity = new InvoiceEntity({
      id: record.id,
      createdAt: record.createdAt!,
      updatedAt: record.updatedAt!,
      props: {
        status: InvoiceStatusEnum[record.status],
        invoiceDate: record.invoiceDate,
        terms: record.terms,
        dueDate: record.dueDate!,
        balanceDue: Number(record.balanceDue),
        notesToClient: record.notesToClient,
        clientOrganizationId: record.clientOrganizationId,
        organizationName: record.organizationName,
        serviceMonth: record.serviceMonth,
        subTotal: Number(record.subTotal),
        volumeTierDiscount: Number(record.volumeTierDiscount),
        total: Number(record.total),
        payments: [], //records.payments,
        paymentTotal: Number(record.paymentTotal),
        amountPaid: Number(record.amountPaid),
        appliedCredit: Number(record.appliedCredit),
        issuedAt: record.issuedAt,
        currentCc: record.currentCc?.split(',').map((cc) => new EmailVO(cc)) || [],
        invoiceIssueHistories: record.invoiceIssueHistories.map(
          (history) =>
            new InvoiceIssueHistory({
              invoiceId: history.invoiceId,
              to: new InvoiceRecipientEmail({ value: history.to }),
              cc: history.cc?.split(',').map((cc) => new EmailVO(cc)) || [],
              issuedAt: history.issuedAt,
              issuedByUserId: new IssuedByUserId({ value: history.issuedByUserId }),
              issuedByUserName: new IssuedByUserName({ value: history.issuedByUserName }),
            }),
        ),
      },
    })
    return entity
  }

  toResponse(entity: InvoiceEntity): InvoiceResponseDto {
    return {} as InvoiceResponseDto
  }
}
