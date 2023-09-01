import { JobEntity } from './domain/job.entity'
import { OrderedJobs, OrderedTasks, Prisma } from '@prisma/client'
import { JobResponseDto } from './dtos/job.response.dto'
import { Injectable } from '@nestjs/common'
import { Mapper } from '../../libs/ddd/mapper.interface'
import { JobStatus } from './domain/job.type'
import { ClientInformation } from './domain/value-objects/client-information.value-object'
import { OrderedTask } from './domain/value-objects/ordered-task.value-object'

@Injectable()
export class JobMapper implements Mapper<JobEntity, OrderedJobs, JobResponseDto> {
  toPersistence(entity: JobEntity): OrderedJobs {
    const props = entity.getProps()
    return {
      id: props.id,
      propertyAddress: props.propertyAddress, // TODO: 컬럼에서 제거 고려 (주소 검색시 프로젝트 테이블에서 검색)
      jobStatus: props.jobStatus,
      additionalInformationFromClient: props.additionalInformationFromClient,
      clientId: props.clientInfo.clientOrganizationId,
      clientContact: props.clientInfo.clientContact,
      clientContactEmail: props.clientInfo.clientContactEmail,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
      receivedAt: props.receivedAt,
      projectId: props.projectId,
      systemSize: new Prisma.Decimal(props.systemSize),
      mailingAddressForWetStamp: props.mailingAddressForWetStamp,
      numberOfWetStamp: props.numberOfWetStamp,
      jobNumber: props.jobNumber,
      projectType: props.projectId,
      deliverablesEmail: props.clientInfo.deliverablesEmail,
      updatedBy: props.updatedBy,
      jobRequestNumber: props.jobRequestNumber,
      mountingType: props.mountingType,
      job_name: props.jobName,

      commercialJobPrice: null, //new Prisma.Decimal(props.commercialJobPrice),

      otherComments: null,
      jobNotesF: null,
      agreedMinimumUnits: null,
      agreedRelatedTieredUnitDescription: null,
      agreedTier1Operator: null,
      agreedTier1Units: null,
      agreedTier2Operator: null,
      agreedTier2Units: null,
      agreedTier3Operator: null,
      agreedTier3Units: null,
      approvedForInvoice: null,
      lineItemIssued: null,
      invoiceCancelledJob: null,
      cancelJob: null,
      chargeForAnyRevision: null,
      chargeForAnyRevisionOverride: null,
      chargeForAnyRevisionSnapshot: null,
      clientContactEmailOverride: null,
      completedCancelledDate: null,
      deliverablesLink: null,
      electricalPEAndWetStampGlSolargraf: null,
      estimatedDaysToComplete: null,
      estimatedDaysToCompleteOverride: null,
      everOnHold: null,
      exportId: null,
      formulaSandbox: null,
      formulaSandboxCountdown: null,
      formulaSandboxParcelTracker: null,
      formulaSandbox2: null,
      formulaSandbox3: null,
      formulaSandbox4: null,
      formulaSandbox5: null,
      formulaSandbox6: null,
      googleDriveJobDeliverablesFolderId: null,
      googleDriveJobFolderId: null,
      inReview: null,
      isDesignJob: null,
      isLocked: null,
      isRevision: null,
      maximumMessageDateTime: null,
      maximumUnixTime: null,
      adminComments: null,
      relatedLineItem: null,
      restrictedAccess: null,
      serviceOrderId: null,
      showClientStructuralUpgradeMessage: null,
      sixMonthsPrior: null,
      standardPricing: null,
      structuralOrElectricalPEAndWetStampSelectedGl: null,
      dateDue: null,
      dateSentToClient: null,
    }
  }

  toDomain(
    record: OrderedJobs & {
      orderedTasks: OrderedTasks[]
      isCurrentJob?: boolean
    },
  ): JobEntity {
    const orderdTasks = record.orderedTasks.map((task) => {
      return new OrderedTask({
        id: task.id,
        isNewTask: task.isNewTask,
        isLocked: task.isLocked,
        taskStatus: task.taskStatus,
        taskName: task.taskName,
        taskId: task.taskMenuId,
        jobId: task.jobId,
        projectId: task.projectId,
        dateCreated: task.dateCreated,
        assignedTo: task.assignedTo,
        assignedUserId: task.assignedUserId,
        description: task.description,
      })
    })

    return new JobEntity({
      id: record.id,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
      props: {
        projectId: record.projectId,
        mountingType: record.mountingType,
        jobStatus: record.jobStatus as JobStatus,
        jobRequestNumber: record.jobRequestNumber,
        propertyAddress: record.propertyAddress,
        jobNumber: record.jobNumber,
        jobName: record.job_name,
        orderedTasks: orderdTasks,
        systemSize: Number(record.systemSize),
        mailingAddressForWetStamp: record.mailingAddressForWetStamp,
        numberOfWetStamp: record.numberOfWetStamp,
        additionalInformationFromClient: record.additionalInformationFromClient,
        clientInfo: new ClientInformation({
          clientOrganizationId: record.clientId,
          clientContact: record.clientContact,
          clientContactEmail: record.clientContactEmail,
          deliverablesEmail: record.deliverablesEmail,
        }),
        updatedBy: record.updatedBy,
        receivedAt: record.receivedAt,
        isCurrentJob: record.isCurrentJob,
      },
    })
  }

  toResponse(entity: JobEntity, ...dtos: any): JobResponseDto {
    // throw new Error('Method not implemented.')
    return
  }
}
