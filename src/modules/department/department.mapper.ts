import { Departments } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { Mapper } from '../../libs/ddd/mapper.interface'
import { DepartmentResponseDto } from './dtos/department.response.dto'
import { DepartmentEntity } from './domain/department.entity'

@Injectable()
export class DepartmentMapper implements Mapper<DepartmentEntity, Departments, DepartmentResponseDto> {
  toPersistence(entity: DepartmentEntity): Departments {
    const props = entity.getProps()
    const record: Departments = {
      id: props.id,
      name: props.name,
      description: props.description,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
      viewClientInvoice: props.viewClientInvoice,
      viewVendorInvoice: props.viewVendorInvoice,
      viewCustomPricing: props.viewCustomPricing,
      viewExpensePricing: props.viewExpensePricing,
      viewScopePrice: props.viewScopePrice,
      viewTaskCost: props.viewTaskCost,
    }
    return record
  }

  toDomain(record: Departments): DepartmentEntity {
    const entity = new DepartmentEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        name: record.name,
        description: record.description,
        viewClientInvoice: record.viewClientInvoice,
        viewVendorInvoice: record.viewVendorInvoice,
        viewCustomPricing: record.viewCustomPricing,
        viewExpensePricing: record.viewExpensePricing,
        viewScopePrice: record.viewScopePrice,
        viewTaskCost: record.viewTaskCost,
      },
    })
    return entity
  }

  toResponse(entity: DepartmentEntity): DepartmentResponseDto {
    const props = entity.getProps()
    const response = new DepartmentResponseDto({
      id: props.id,
      name: props.name,
      description: props.description,
      viewClientInvoice: props.viewClientInvoice,
      viewVendorInvoice: props.viewVendorInvoice,
      viewCustomPricing: props.viewCustomPricing,
      viewExpensePricing: props.viewExpensePricing,
      viewScopePrice: props.viewScopePrice,
      viewTaskCost: props.viewTaskCost,
    })
    return response
  }
}
