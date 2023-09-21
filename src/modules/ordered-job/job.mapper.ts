import { JobEntity } from './domain/job.entity'
import { OrderedJobs, OrderedTasks, Prisma } from '@prisma/client'
import { JobResponseDto, OrderedTaskResponseFields } from './dtos/job.response.dto'
import { Injectable } from '@nestjs/common'
import { Mapper } from '../../libs/ddd/mapper.interface'
import { JobStatus } from './domain/job.type'
import { ClientInformation } from './domain/value-objects/client-information.value-object'
import { OrderedTask } from './domain/value-objects/ordered-task.value-object'
import { Address } from '../organization/domain/value-objects/address.vo'

@Injectable()
export class JobMapper implements Mapper<JobEntity, OrderedJobs, JobResponseDto> {
  toPersistence(entity: JobEntity): OrderedJobs {
    const props = entity.getProps()
    return {
      id: props.id,
      propertyAddress: props.propertyFullAddress, // TODO: 컬럼에서 제거 고려 (주소 검색시 프로젝트 테이블에서 검색)
      jobStatus: props.jobStatus,
      additionalInformationFromClient: props.additionalInformationFromClient,
      clientOrganizationId: props.clientInfo.clientOrganizationId,
      clientOrganizationName: props.clientInfo.clientOrganizationName,
      clientContactEmail: props.clientInfo.clientContactEmail,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
      receivedAt: props.receivedAt,
      projectId: props.projectId,
      systemSize: props.systemSize ? new Prisma.Decimal(props.systemSize) : null,
      mailingFullAddressForWetStamp: props.mailingAddressForWetStamp?.fullAddress || null,
      mailingAdderssState: props.mailingAddressForWetStamp?.state || null,
      mailingAdderssCity: props.mailingAddressForWetStamp?.city || null,
      mailingAdderssCoordinates: props.mailingAddressForWetStamp?.coordinates.toString() || null,
      mailingAdderssStreet1: props.mailingAddressForWetStamp?.street1 || null,
      mailingAdderssStreet2: props.mailingAddressForWetStamp?.street2 || null,
      mailingAdderssPostalCode: props.mailingAddressForWetStamp?.postalCode || null,
      mailingAdderssPostalCountry: props.mailingAddressForWetStamp?.country || null,
      numberOfWetStamp: props.numberOfWetStamp,
      projectType: props.projectType,
      deliverablesEmail: props.clientInfo.deliverablesEmail.toString(),
      updatedBy: props.updatedBy,
      jobRequestNumber: props.jobRequestNumber,
      mountingType: props.mountingType,
      jobName: props.jobName,
      isExpedited: props.isExpedited,
      clientUserId: props.clientInfo.clientUserId,
      clientUserName: props.clientInfo.clientUserName,

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
      orderedTasks: OrderedTasks[] | null
      isCurrentJob?: boolean
    },
  ): JobEntity {
    const orderedTasks = record.orderedTasks?.map((task) => {
      return new OrderedTask({
        id: task.id,
        invoiceAmount: task.invoiceAmount,
        isNewTask: task.isNewTask,
        taskStatus: task.taskStatus,
        taskName: task.taskName,
        taskId: task.taskMenuId,
        jobId: task.jobId,
        projectId: task.projectId,
        createdAt: task.dateCreated,
        assigneeName: task.assigneeName,
        assigneeUserId: task.assigneeUserId,
        description: task.description,
      })
    })

    // const hasMailingForWetStamp =

    return new JobEntity({
      id: record.id,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
      props: {
        projectId: record.projectId,
        projectType: record.projectType,
        mountingType: record.mountingType,
        jobStatus: record.jobStatus as JobStatus, // TODO: status any
        jobRequestNumber: record.jobRequestNumber,
        propertyFullAddress: record.propertyAddress,
        deliverablesEmails: record.deliverablesEmail?.split(',') || [],
        jobName: record.jobName,
        orderedTasks: orderedTasks || [],
        systemSize: record.systemSize ? Number(record.systemSize) : null,
        mailingAddressForWetStamp:
          record.mailingAdderssCity !== null &&
          record.mailingAdderssPostalCountry !== null &&
          record.mailingAdderssPostalCode !== null &&
          record.mailingAdderssState !== null &&
          record.mailingAdderssStreet1 !== null &&
          record.mailingFullAddressForWetStamp !== null &&
          record.mailingAdderssCoordinates !== null
            ? new Address({
                city: record.mailingAdderssCity,
                country: record.mailingAdderssPostalCountry,
                postalCode: record.mailingAdderssPostalCode,
                state: record.mailingAdderssState,
                street1: record.mailingAdderssStreet1,
                street2: record.mailingAdderssStreet2,
                fullAddress: record.mailingFullAddressForWetStamp,
                coordinates: record.mailingAdderssCoordinates.split(',').map((n) => Number(n)),
              })
            : null,
        numberOfWetStamp: record.numberOfWetStamp,
        additionalInformationFromClient: record.additionalInformationFromClient,
        clientInfo: new ClientInformation({
          clientOrganizationId: record.clientOrganizationId,
          clientOrganizationName: record.clientOrganizationName,
          clientUserId: record.clientUserId,
          clientUserName: record.clientUserName,
          clientContactEmail: record.clientContactEmail,
          deliverablesEmail: record.deliverablesEmail?.split(',') || [],
        }),
        updatedBy: record.updatedBy,
        receivedAt: record.receivedAt,
        isExpedited: !!record.isExpedited,
        isCurrentJob: record.isCurrentJob,
      },
    })
  }

  toResponse(entity: JobEntity): JobResponseDto {
    const props = entity.getProps()
    const response = new JobResponseDto()

    response.id = props.id
    response.projectId = props.projectId
    response.systemSize = props.systemSize
    response.mailingAddressForWetStamp = props.mailingAddressForWetStamp
    response.mountingType = props.mountingType
    response.numberOfWetStamp = props.numberOfWetStamp
    response.additionalInformationFromClient = props.additionalInformationFromClient
    response.updatedBy = props.updatedBy
    response.propertyFullAddress = props.propertyFullAddress
    response.jobRequestNumber = props.jobRequestNumber
    response.jobStatus = props.jobStatus
    response.projectType = props.projectType
    response.receivedAt = props.receivedAt.toISOString()
    response.isExpedited = props.isExpedited
    response.jobName = props.jobName
    response.isCurrentJob = props.isCurrentJob

    response.orderedTasks = props.orderedTasks.map((task) => {
      return new OrderedTaskResponseFields({
        id: task.id,
        taskStatus: task.taskStatus,
        taskName: task.taskName,
        assignee: {
          userId: task.assigneeUserId,
          name: task.assigneeName,
        },
        description: task.description,
        invoiceAmount: task.invoiceAmount,
        isNewTask: task.isNewTask,
        createdAt: task.createdAt.toISOString(),
      })
    })

    response.clientInfo = {
      clientOrganizationId: props.clientInfo.clientOrganizationId,
      clientOrganizationName: props.clientInfo.clientOrganizationName,
      clientUserName: props.clientInfo.clientUserName, // TODO: project나 조직도 join 해야하나
      clientUserId: props.clientInfo.clientUserId, // TODO: project나 조직도 join 해야하나
      contactEmail: props.clientInfo.clientContactEmail,
      deliverablesEmails: props.clientInfo.deliverablesEmail,
    }

    return response
  }
}
