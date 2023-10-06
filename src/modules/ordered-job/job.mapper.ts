import { JobEntity } from './domain/job.entity'
import { AssignedTasks, OrderedJobs, OrderedServices, Prisma, Service, Tasks, Users } from '@prisma/client'
import { JobResponseDto } from './dtos/job.response.dto'
import { Injectable } from '@nestjs/common'
import { Mapper } from '../../libs/ddd/mapper.interface'
import { JobStatus } from './domain/job.type'
import { ClientInformation } from './domain/value-objects/client-information.value-object'
import { AssignedTask } from './domain/value-objects/assigned-task.value-object'
import { Address } from '../organization/domain/value-objects/address.vo'
import { AssignedTaskStatus } from '../assigned-task/domain/assigned-task.type'
import { OrderedService } from './domain/value-objects/ordered-service.value-object'
import { OrderedServiceSizeForRevisionEnum, OrderedServiceStatus } from '../ordered-service/domain/ordered-service.type'
import { ProjectPropertyType, ProjectPropertyTypeEnum } from '../project/domain/project.type'
import { TaskSizeEnum } from '../invoice/dtos/invoice.response.dto'

@Injectable()
export class JobMapper implements Mapper<JobEntity, OrderedJobs, JobResponseDto> {
  toPersistence(entity: JobEntity): OrderedJobs {
    const props = entity.getProps()
    return {
      id: props.id,
      invoiceId: props.invoiceId,
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
      orderedServices: (OrderedServices & {
        service: Service
        assignedTasks: (AssignedTasks & { task: Tasks; user: Users | null })[]
      })[]
      isCurrentJob?: boolean
    },
  ): JobEntity {
    const assignedTasks: AssignedTask[] = []
    record.orderedServices.map((orderedService) => {
      orderedService.assignedTasks.map((assignedTask) => {
        assignedTasks.push(
          new AssignedTask({
            assignTaskId: assignedTask.id,
            status: assignedTask.status as AssignedTaskStatus,
            taskName: assignedTask.task.name,
            taskId: assignedTask.taskId,
            orderedServiceId: assignedTask.orderedServiceId,
            jobId: assignedTask.jobId,
            startedAt: assignedTask.startedAt,
            assigneeName: assignedTask.user ? assignedTask.user.firstName + ' ' + assignedTask.user.lastName : null,
            assigneeId: assignedTask.assigneeId,
            doneAt: assignedTask.doneAt,
            description: orderedService.description,
          }),
        )
      })
    })

    const sizeForRevision = record.orderedServices.find(
      (orderedService) =>
        orderedService.isRevision && orderedService.sizeForRevision === OrderedServiceSizeForRevisionEnum.Major,
    )
      ? TaskSizeEnum.Major
      : record.orderedServices.find(
          (orderedService) =>
            orderedService.isRevision && orderedService.sizeForRevision === OrderedServiceSizeForRevisionEnum.Minor,
        )
      ? TaskSizeEnum.Minor
      : null

    const orderedServices: OrderedService[] = []
    record.orderedServices.map((orderedService) => {
      orderedServices.push(
        new OrderedService({
          sizeForRevision:
            sizeForRevision === TaskSizeEnum.Major
              ? OrderedServiceSizeForRevisionEnum.Major
              : sizeForRevision === TaskSizeEnum.Minor
              ? OrderedServiceSizeForRevisionEnum.Minor
              : null,
          isRevision: orderedService.isRevision,
          billingCode: orderedService.service.billingCode,
          basePrice: Number(orderedService.service.basePrice),
          orderedServiceId: orderedService.id,
          serviceId: orderedService.serviceId,
          serviceName: orderedService.service.name,
          jobId: orderedService.jobId,
          description: orderedService.description,
          price: Number(orderedService.price),
          priceOverride: orderedService.priceOverride ? Number(orderedService.priceOverride) : null,
          orderedAt: orderedService.orderedAt,
          status: orderedService.status as OrderedServiceStatus,
          doneAt: orderedService.doneAt,
        }),
      )
    })

    return new JobEntity({
      id: record.id,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
      props: {
        projectId: record.projectId,
        invoiceId: record.invoiceId,
        projectType: record.projectType,
        mountingType: record.mountingType,
        jobStatus: record.jobStatus as JobStatus, // TODO: status any
        jobRequestNumber: record.jobRequestNumber,
        propertyFullAddress: record.propertyAddress,
        deliverablesEmails: record.deliverablesEmail?.split(',') || [],
        jobName: record.jobName,
        assignedTasks: assignedTasks || [],
        orderedServices: orderedServices,
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

    const sizeForRevision = props.orderedServices.find(
      (orderedService) =>
        orderedService.isRevision && orderedService.sizeForRevision === OrderedServiceSizeForRevisionEnum.Major,
    )
      ? TaskSizeEnum.Major
      : props.orderedServices.find(
          (orderedService) =>
            orderedService.isRevision && orderedService.sizeForRevision === OrderedServiceSizeForRevisionEnum.Minor,
        )
      ? TaskSizeEnum.Minor
      : null

    const isContainsRevisionTask = props.orderedServices.find((orderedService) => orderedService.isRevision)

    const response = new JobResponseDto({
      id: props.id,
      isContainsRevisionTask: !!isContainsRevisionTask,
      billingCodes: props.orderedServices.map((orderedService) => orderedService.billingCode),
      propertyType: ProjectPropertyTypeEnum[props.projectType as ProjectPropertyType],
      taskSizeForRevision: sizeForRevision,
      projectId: props.projectId,
      systemSize: props.systemSize,
      mailingAddressForWetStamp: props.mailingAddressForWetStamp,
      mountingType: props.mountingType,
      numberOfWetStamp: props.numberOfWetStamp,
      additionalInformationFromClient: props.additionalInformationFromClient,
      updatedBy: props.updatedBy,
      propertyFullAddress: props.propertyFullAddress,
      jobRequestNumber: props.jobRequestNumber,
      jobStatus: props.jobStatus,
      projectType: props.projectType,
      receivedAt: props.receivedAt.toISOString(),
      isExpedited: props.isExpedited,
      jobName: props.jobName,
      isCurrentJob: props.isCurrentJob,
      assignedTasks: props.assignedTasks.map((assignedTask) => ({
        ...assignedTask.unpack(),
        startedAt: assignedTask.startedAt?.toISOString() || null,
        doneAt: assignedTask.doneAt?.toISOString() || null,
      })),

      orderedServices: props.orderedServices.map((service) => ({
        ...service.unpack(),
        price: Number(service.price),
        priceOverride: service.priceOverride ? Number(service.priceOverride) : null,
        orderedAt: service.orderedAt.toISOString(),
        doneAt: service.doneAt?.toISOString() || null,
      })),

      clientInfo: {
        clientOrganizationId: props.clientInfo.clientOrganizationId,
        clientOrganizationName: props.clientInfo.clientOrganizationName,
        clientUserName: props.clientInfo.clientUserName, // TODO: project나 조직도 join 해야하나
        clientUserId: props.clientInfo.clientUserId, // TODO: project나 조직도 join 해야하나
        contactEmail: props.clientInfo.clientContactEmail,
        deliverablesEmails: props.clientInfo.deliverablesEmail,
      },
    })

    return response
  }
}
