import { AssignedTasks, Prisma } from '@prisma/client'
import { BadRequestException, Injectable } from '@nestjs/common'
import { Mapper } from '../../libs/ddd/mapper.interface'
import { AssignedTaskResponseDto } from './dtos/assigned-task.response.dto'
import { AssignedTaskEntity } from './domain/assigned-task.entity'
import { AssignedTaskStatus } from './domain/assigned-task.type'
import { MountingTypeEnum, ProjectPropertyTypeEnum } from '../project/domain/project.type'

@Injectable()
export class AssignedTaskMapper implements Mapper<AssignedTaskEntity, AssignedTasks, AssignedTaskResponseDto> {
  toPersistence(entity: AssignedTaskEntity): AssignedTasks {
    const props = entity.getProps()
    const record: AssignedTasks = {
      id: props.id,
      taskId: props.taskId,
      orderedServiceId: props.orderedServiceId,
      jobId: props.jobId,
      duration: props.duration,
      status: props.status,
      assigneeId: props.assigneeId,
      assigneeName: props.assigneeName,
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
    }
    return record
  }

  toDomain(record: AssignedTasks): AssignedTaskEntity {
    const entity = new AssignedTaskEntity({
      id: record.id,
      props: {
        taskId: record.taskId,
        orderedServiceId: record.orderedServiceId,
        jobId: record.jobId,
        status: record.status as AssignedTaskStatus,
        assigneeId: record.assigneeId,
        assigneeName: record.assigneeName,
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
      },
    })
    return entity
  }

  toResponse(entity: AssignedTaskEntity): AssignedTaskResponseDto {
    throw new BadRequestException('toResponse doesnt be implemented.')
  }
}
