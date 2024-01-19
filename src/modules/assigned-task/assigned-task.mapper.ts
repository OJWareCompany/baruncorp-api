import { AssignedTasks, Prisma } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { Mapper } from '../../libs/ddd/mapper.interface'
import { AssignedTaskResponseDto } from './dtos/assigned-task.response.dto'
import { AssignedTaskEntity } from './domain/assigned-task.entity'
import { MountingTypeEnum, ProjectPropertyTypeEnum } from '../project/domain/project.type'
import { VendorInvoiceLineItemResponse } from '../vendor-invoice/dtos/vendor-invoice-line-item.response.dto'
import { AssignedTaskStatusEnum } from './domain/assigned-task.type'

@Injectable()
export class AssignedTaskMapper implements Mapper<AssignedTaskEntity, AssignedTasks, AssignedTaskResponseDto> {
  toPersistence(entity: AssignedTaskEntity): AssignedTasks {
    const props = entity.getProps()
    const record: AssignedTasks = {
      id: entity.id,
      taskId: props.taskId,
      orderedServiceId: props.orderedServiceId,
      jobId: props.jobId,
      duration: props.duration,
      status: props.status,
      assigneeId: props.assigneeId,
      assigneeName: props.assigneeName,
      assigneeOrganizationId: props.assigneeOrganizationId,
      assigneeOrganizationName: props.assigneeOrganizationName,
      startedAt: props.startedAt,
      doneAt: props.doneAt,
      taskName: props.taskName,
      serviceName: props.serviceName,
      projectId: props.projectId,
      organizationId: props.organizationId,
      organizationName: props.organizationName,
      projectPropertyType: props.projectPropertyType,
      mountingType: props.mountingType,
      description: props.description,
      serviceId: props.serviceId,
      cost: props.cost ? new Prisma.Decimal(props.cost) : null,
      isVendor: props.isVendor,
      vendorInvoiceId: props.vendorInvoiceId,
      isRevision: props.isRevision,
      projectNumber: props.projectNumber,
      projectPropertyOwnerName: props.projectPropertyOwnerName,
      jobName: props.jobName,
      is_expedited: props.isExpedited,
      is_active: props.isActive,
      created_at: props.createdAt,
    }
    return record
  }

  toDomain(record: AssignedTasks): AssignedTaskEntity {
    const entity = new AssignedTaskEntity({
      id: record.id,
      createdAt: record.created_at,
      props: {
        taskId: record.taskId,
        orderedServiceId: record.orderedServiceId,
        jobId: record.jobId,
        status: record.status as AssignedTaskStatusEnum,
        assigneeId: record.assigneeId,
        assigneeName: record.assigneeName,
        assigneeOrganizationId: record.assigneeOrganizationId,
        assigneeOrganizationName: record.assigneeOrganizationName,
        duration: record.duration,
        startedAt: record.startedAt,
        doneAt: record.doneAt,
        taskName: record.taskName,
        serviceName: record.serviceName,
        projectId: record.projectId,
        organizationId: record.organizationId,
        organizationName: record.organizationName,
        projectPropertyType: record.projectPropertyType as ProjectPropertyTypeEnum,
        mountingType: record.mountingType as MountingTypeEnum,
        description: record.description,
        serviceId: record.serviceId,
        cost: record.cost ? Number(record.cost) : null,
        isVendor: record.isVendor,
        vendorInvoiceId: record.vendorInvoiceId,
        isRevision: record.isRevision,
        projectNumber: record.projectNumber,
        projectPropertyOwnerName: record.projectPropertyOwnerName,
        jobName: record.jobName,
        isExpedited: record.is_expedited,
        isActive: record.is_active,
      },
    })
    return entity
  }

  toResponse(entity: AssignedTaskEntity): AssignedTaskResponseDto {
    const props = entity.getProps()
    return new AssignedTaskResponseDto({
      id: props.id,
      taskId: props.taskId,
      orderedServiceId: props.orderedServiceId,
      jobId: props.jobId,
      status: props.status,
      description: props.description,
      assigneeId: props.assigneeId,
      assigneeName: props.assigneeName,
      assigneeOrganizationId: props.assigneeOrganizationId,
      assigneeOrganizationName: props.assigneeOrganizationName,
      duration: props.duration,
      startedAt: props.startedAt,
      doneAt: props.doneAt,
      taskName: props.taskName,
      serviceName: props.serviceName,
      projectId: props.projectId,
      organizationId: props.organizationId,
      organizationName: props.organizationName,
      projectPropertyType: props.projectPropertyType,
      mountingType: props.mountingType,
      cost: props.cost ? Number(props.cost) : null,
      isVendor: props.isVendor,
      vendorInvoiceId: props.vendorInvoiceId,
      serviceId: props.serviceId,
      createdAt: props.createdAt,
    })
  }

  toResponseForVendorLineItem(entity: AssignedTaskEntity): VendorInvoiceLineItemResponse {
    const response = new VendorInvoiceLineItemResponse()
    response.vendorInvoiceId = entity.getProps().vendorInvoiceId!
    response.taskId = entity.getProps().taskId
    response.assigneeId = entity.getProps().assigneeId!
    response.assigneeName = entity.getProps().assigneeName!
    response.assigneeOrganizationId = entity.getProps().assigneeOrganizationId!
    response.assigneeOrganizationName = entity.getProps().assigneeOrganizationName!
    response.clientOrganizationId = entity.getProps().organizationId
    response.clientOrganizationName = entity.getProps().organizationName
    response.projectId = entity.getProps().projectId
    response.projectNumber = entity.getProps().projectNumber
    response.jobDescription = entity.getProps().jobName
    response.propertyOwnerName = entity.getProps().projectPropertyOwnerName
    response.serviceName = entity.getProps().serviceName
    response.serviceDescription = entity.getProps().description
    response.taskExpenseTotal = entity.getProps().cost!
    response.isRevision = entity.getProps().isRevision
    response.createdAt = entity.getProps().createdAt.toISOString()
    response.doneAt = entity.getProps().doneAt!.toISOString()
    return response
  }
}
