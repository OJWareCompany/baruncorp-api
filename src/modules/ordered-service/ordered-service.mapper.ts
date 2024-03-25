import { AssignedTasks, OrderedServices, Prisma } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { Mapper } from '../../libs/ddd/mapper.interface'
import { MountingTypeEnum, ProjectPropertyTypeEnum } from '../project/domain/project.type'
import { OrderedServiceResponseDto } from './dtos/ordered-service.response.dto'
import { OrderedServiceEntity } from './domain/ordered-service.entity'
import {
  OrderedServicePricingTypeEnum,
  OrderedServiceSizeForRevision,
  OrderedServiceSizeForRevisionEnum,
  OrderedServiceStatusEnum,
} from './domain/ordered-service.type'
import { OrderedJobsPriorityEnum, Priority } from '../ordered-job/domain/value-objects/priority.value-object'

@Injectable()
export class OrderedServiceMapper implements Mapper<OrderedServiceEntity, OrderedServices, OrderedServiceResponseDto> {
  toPersistence(entity: OrderedServiceEntity): OrderedServices {
    const props = entity.getProps()
    return {
      id: props.id,
      serviceId: props.serviceId,
      isRevision: props.isRevision,
      sizeForRevision: props.sizeForRevision,
      projectId: props.projectId,
      jobId: props.jobId,
      description: props.description,
      pricing_type: props.pricingType,
      price: props.price === null ? null : new Prisma.Decimal(props.price.toFixed(4)),
      priceOverride: props.priceOverride === null ? null : new Prisma.Decimal(props.priceOverride.toFixed(4)),
      status: props.status,
      orderedAt: props.orderedAt,
      doneAt: props.doneAt,
      isManualPrice: props.isManualPrice,
      projectPropertyType: props.projectPropertyType,
      mountingType: props.mountingType,
      organizationId: props.organizationId,
      organizationName: props.organizationName,
      serviceName: props.serviceName,
      projectNumber: props.projectNumber,
      projectPropertyOwnerName: props.projectPropertyOwnerName,
      jobName: props.jobName,
      is_expedited: props.isExpedited,
      updated_at: props.updatedAt,
      updated_by: props.updatedBy,
      editor_user_id: props.editorUserId,
      priority: props.priority.name,
      priorityLevel: props.priority.level,
    }
  }

  toDomain(record: OrderedServices & { assignedTasks: AssignedTasks[] }): OrderedServiceEntity {
    const entity = new OrderedServiceEntity({
      id: record.id,
      updatedAt: record.updated_at,
      props: {
        serviceId: record.serviceId,
        projectId: record.projectId,
        jobId: record.jobId,
        isRevision: record.isRevision,
        sizeForRevision: record.sizeForRevision
          ? OrderedServiceSizeForRevisionEnum[record.sizeForRevision as OrderedServiceSizeForRevision]
          : null,
        description: record.description,
        pricingType: record.pricing_type as OrderedServicePricingTypeEnum,
        price: record.price === null ? null : Number(record.price),
        priceOverride: record.priceOverride === null ? null : Number(record.priceOverride),
        orderedAt: record.orderedAt,
        doneAt: record.doneAt,
        status: record.status as OrderedServiceStatusEnum,
        isManualPrice: record.isManualPrice, //record.isManualPrice,
        assignedTasks: record.assignedTasks,
        projectPropertyType: record.projectPropertyType as ProjectPropertyTypeEnum,
        mountingType: record.mountingType as MountingTypeEnum,
        organizationId: record.organizationId,
        organizationName: record.organizationName,
        serviceName: record.serviceName,
        projectNumber: record.projectNumber,
        projectPropertyOwnerName: record.projectPropertyOwnerName,
        jobName: record.jobName,
        isExpedited: record.is_expedited,
        updatedBy: record.updated_by,
        editorUserId: record.editor_user_id,
        priority: new Priority({ priority: record.priority as OrderedJobsPriorityEnum }),
      },
    })
    return entity
  }

  toResponse(entity: OrderedServiceEntity): OrderedServiceResponseDto {
    throw new Error('Method not implemented.')
  }
}
