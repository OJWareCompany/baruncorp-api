import { ExpensePricings } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { Mapper } from '../../libs/ddd/mapper.interface'
import { ExpensePricingResponseDto } from './dtos/expense-pricing.response.dto'
import { ExpensePricingEntity } from './domain/expense-pricing.entity'
import { Decimal } from '@prisma/client/runtime/library'
import { ExpenseTypeEnum } from './commands/create-expense-pricing/create-expense-pricing.command'

@Injectable()
export class ExpensePricingMapper implements Mapper<ExpensePricingEntity, ExpensePricings, ExpensePricingResponseDto> {
  toPersistence(entity: ExpensePricingEntity): ExpensePricings {
    const props = entity.getProps()
    const record: ExpensePricings = {
      id: props.id,
      taskId: props.taskId,
      organizationId: props.organizationId,
      taskName: props.taskName,
      resiNewExpenseType: props.resiNewExpenseType,
      resiNewValue: new Decimal(props.resiNewValue.toFixed(4)),
      resiRevExpenseType: props.resiRevExpenseType,
      resiRevValue: new Decimal(props.resiRevValue.toFixed(4)),
      comNewExpenseType: props.comNewExpenseType,
      comNewValue: new Decimal(props.comNewValue.toFixed(4)),
      comRevExpenseType: props.comRevExpenseType,
      comRevValue: new Decimal(props.comRevValue.toFixed(4)),
    }
    return record
  }

  toDomain(record: ExpensePricings): ExpensePricingEntity {
    const entity = new ExpensePricingEntity({
      id: record.id,
      props: {
        taskId: record.taskId,
        organizationId: record.organizationId,
        taskName: record.taskName,
        resiNewExpenseType: record.resiNewExpenseType as ExpenseTypeEnum,
        resiNewValue: Number(record.resiNewValue),
        resiRevExpenseType: record.resiRevExpenseType as ExpenseTypeEnum,
        resiRevValue: Number(record.resiRevValue),
        comNewExpenseType: record.comNewExpenseType as ExpenseTypeEnum,
        comNewValue: Number(record.comNewValue),
        comRevExpenseType: record.comRevExpenseType as ExpenseTypeEnum,
        comRevValue: Number(record.comRevValue),
      },
    })
    return entity
  }

  toResponse(entity: ExpensePricingEntity): ExpensePricingResponseDto {
    const props = entity.getProps()
    const response = new ExpensePricingResponseDto({
      taskId: props.taskId,
      organizationId: props.organizationId,
      taskName: props.taskName,
      resiNewExpenseType: props.resiNewExpenseType,
      resiNewValue: Number(props.resiNewValue),
      resiRevExpenseType: props.resiRevExpenseType,
      resiRevValue: Number(props.resiRevValue),
      comNewExpenseType: props.comNewExpenseType,
      comNewValue: Number(props.comNewValue),
      comRevExpenseType: props.comRevExpenseType,
      comRevValue: Number(props.comRevValue),
    })
    return response
  }
}
