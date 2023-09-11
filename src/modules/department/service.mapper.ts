import { Injectable } from '@nestjs/common'
import { Mapper } from '@libs/ddd/mapper.interface'
import { ServiceModel } from './database/department.repository'
import { ServiceEntity, ServiceProps } from './domain/service.entity'
import { ServiceResponseDto } from './dtos/service.response.dto'
import { Prisma } from '@prisma/client'

@Injectable()
export class ServiceMapper implements Mapper<ServiceEntity, ServiceModel, ServiceResponseDto> {
  toPersistence(entity: ServiceEntity): ServiceModel {
    const props = entity.getProps()
    const record: ServiceModel = {
      id: props.id,
      name: props.description,
      description: props.description,
      updatedAt: new Date(),
      createdAt: new Date(),
      billing_code: props.billing_code,
      state_restricted: props.state_restricted,
      is_current_user: props.is_current_user,
      internal_only: props.internal_only,
      man_minutes_residential_new_standard: new Prisma.Decimal(props.man_minutes_residential_new_standard),
      man_minutes_residential_rev_standard: new Prisma.Decimal(props.man_minutes_residential_rev_standard),
      is_member_assignment: props.isMemberAssignment,
      is_in_order_menu: props.isInOrderMenu,
      parent_task_id: props.parentTaskId,
    }
    return record
  }

  toDomain(record: ServiceModel): ServiceEntity {
    const props: ServiceProps = {
      name: record.name,
      description: record.description,
      updatedAt: record.updatedAt,
      createdAt: record.createdAt,
      billing_code: record.billing_code,
      state_restricted: record.state_restricted,
      is_current_user: record.is_current_user,
      internal_only: record.internal_only,
      man_minutes_residential_new_standard: Number(record.man_minutes_residential_new_standard),
      man_minutes_residential_rev_standard: Number(record.man_minutes_residential_rev_standard),
      isMemberAssignment: record.is_member_assignment,
      isInOrderMenu: record.is_in_order_menu,
      parentTaskId: record.parent_task_id,
    }

    return new ServiceEntity({ id: record.id, props })
  }

  toResponse(entity: ServiceEntity): ServiceResponseDto {
    const copy = entity.getProps()
    const response = new ServiceResponseDto()
    response.id = copy.id
    response.name = copy.name
    response.description = copy.description
    response.isOrderable = !!copy.billing_code
    return response
  }
}
