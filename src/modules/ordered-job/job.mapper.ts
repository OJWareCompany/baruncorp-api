import { JobEntity } from './domain/job.entity'
import {
  AssignedTasks,
  OrderedJobs,
  OrderedServices,
  Prisma,
  Service,
  Tasks,
  Users,
  prerequisiteTasks,
} from '@prisma/client'
import { JobResponseDto } from './dtos/job.response.dto'
import { Injectable } from '@nestjs/common'
import { Mapper } from '../../libs/ddd/mapper.interface'
import { ClientInformation } from './domain/value-objects/client-information.value-object'
import { AssignedTask } from './domain/value-objects/assigned-task.value-object'
import { Address } from '../organization/domain/value-objects/address.vo'
import { OrderedService } from './domain/value-objects/ordered-service.value-object'
import {
  OrderedServiceSizeForRevision,
  OrderedServiceSizeForRevisionEnum,
  OrderedServiceStatusEnum,
} from '../ordered-service/domain/ordered-service.type'
import { MountingTypeEnum, ProjectPropertyTypeEnum } from '../project/domain/project.type'
import { PricingTypeEnum } from '../invoice/dtos/invoice.response.dto'
import { JobStatusEnum } from './domain/job.type'
import { LoadCalcOriginEnum } from './domain/job.type'
import { AssignedTaskStatusEnum } from '../assigned-task/domain/assigned-task.type'
import { OrderedJobsPriorityEnum, Priority } from './domain/value-objects/priority.value-object'

@Injectable()
export class JobMapper implements Mapper<JobEntity, OrderedJobs, JobResponseDto> {
  toPersistence(entity: JobEntity): OrderedJobs {
    const props = entity.getProps()
    return {
      id: props.id,
      project_number: props.projectNumber,
      invoiceId: props.invoiceId,
      revisionSize: props.revisionSize,
      loadCalcOrigin: props.loadCalcOrigin,
      propertyAddress: props.propertyFullAddress, // TODO: 컬럼에서 제거 고려 (주소 검색시 프로젝트 테이블에서 검색)
      jobStatus: props.jobStatus,
      canceled_at: props.canceledAt,
      pricingType: props.pricingType,
      additionalInformationFromClient: props.additionalInformationFromClient,
      clientOrganizationId: props.clientInfo.clientOrganizationId,
      clientOrganizationName: props.clientInfo.clientOrganizationName,
      clientContactEmail: props.clientInfo.clientContactEmail,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
      receivedAt: props.receivedAt,
      projectId: props.projectId,
      systemSize: props.systemSize ? new Prisma.Decimal(props.systemSize.toFixed(4)) : null,
      mailingFullAddressForWetStamp: props.mailingAddressForWetStamp?.fullAddress || null,
      mailingAdderssState: props.mailingAddressForWetStamp?.state || null,
      mailingAdderssCity: props.mailingAddressForWetStamp?.city || null,
      mailingAdderssCoordinates: props.mailingAddressForWetStamp?.coordinates.toString() || null,
      mailingAdderssStreet1: props.mailingAddressForWetStamp?.street1 || null,
      mailingAdderssStreet2: props.mailingAddressForWetStamp?.street2 || null,
      mailingAdderssPostalCode: props.mailingAddressForWetStamp?.postalCode || null,
      mailingAdderssPostalCountry: props.mailingAddressForWetStamp?.country || null,
      numberOfWetStamp: props.numberOfWetStamp,
      projectType: props.projectPropertyType,
      deliverablesEmail: props.clientInfo.deliverablesEmail.toString(),
      updatedBy: props.updatedBy,
      jobRequestNumber: props.jobRequestNumber,
      mountingType: props.mountingType,
      jobName: props.jobName,
      isExpedited: props.isExpedited,
      clientUserId: props.clientInfo.clientUserId,
      clientUserName: props.clientInfo.clientUserName,
      dueDate: props.dueDate,
      dateSentToClient: props.dateSentToClient,
      editor_user_id: props.editorUserId,
      isManualDueDate: props.isManualDueDate,
      inReview: props.inReview,
      priority: props.priority.name,
      priorityLevel: props.priority.level,
      completedCancelledDate: props.completedCancelledDate,
      commercialJobPrice: null, //new Prisma.Decimal(props.commercialJobPrice),
      structuralUpgradeNote: props.structuralUpgradeNote,
      propertyOwner: props.propertyOwner,

      // 퀵베이스에 있던 컬럼중 아직 사용하지 않는 것
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
    }
  }

  toDomain(
    record: OrderedJobs & {
      orderedServices: (OrderedServices & {
        service: Service
        assignedTasks: (AssignedTasks & { task: Tasks; user: Users | null })[]
      })[]
      isCurrentJob?: boolean
      prerequisiteTasks: prerequisiteTasks[]
    },
  ): JobEntity {
    const assignedTasks: AssignedTask[] = []
    record.orderedServices.map((orderedService) => {
      orderedService.assignedTasks.map((assignedTask) => {
        assignedTasks.push(
          new AssignedTask({
            assignTaskId: assignedTask.id,
            status: assignedTask.status as AssignedTaskStatusEnum,
            taskName: assignedTask.task.name,
            taskId: assignedTask.taskId,
            orderedServiceId: assignedTask.orderedServiceId,
            jobId: assignedTask.jobId,
            startedAt: assignedTask.startedAt,
            assigneeName: assignedTask.user ? assignedTask.user.full_name : null,
            assigneeId: assignedTask.assigneeId,
            doneAt: assignedTask.doneAt,
            description: orderedService.description,
            duration: assignedTask.duration ? Number(assignedTask.duration) : null,
            isActive: assignedTask.is_active,
            prerequisiteTasks: record.prerequisiteTasks
              ? record.prerequisiteTasks
                  .filter((pre) => pre.taskId === assignedTask.taskId)
                  .map((pre) => {
                    return {
                      prerequisiteTaskId: pre.prerequisiteTaskId,
                      prerequisiteTaskName: pre.prerequisiteTaskName,
                    }
                  })
              : [],
          }),
        )
      })
    })

    const orderedServices: OrderedService[] = []
    record.orderedServices.map((orderedService) => {
      orderedServices.push(
        new OrderedService({
          sizeForRevision: orderedService.sizeForRevision
            ? OrderedServiceSizeForRevisionEnum[orderedService.sizeForRevision as OrderedServiceSizeForRevision]
            : null,
          isRevision: orderedService.isRevision,
          billingCode: orderedService.service.billingCode,
          basePrice: Number(orderedService.service.basePrice),
          orderedServiceId: orderedService.id,
          serviceId: orderedService.serviceId,
          serviceName: orderedService.service.name,
          jobId: orderedService.jobId,
          description: orderedService.description,
          price: orderedService.price === null ? null : Number(orderedService.price),
          priceOverride: orderedService.priceOverride === null ? null : Number(orderedService.priceOverride),
          orderedAt: orderedService.orderedAt,
          status: orderedService.status as OrderedServiceStatusEnum,
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
        loadCalcOrigin: record.loadCalcOrigin as LoadCalcOriginEnum,
        dueDate: record.dueDate,
        projectNumber: record.project_number,
        invoiceId: record.invoiceId,
        projectPropertyType: record.projectType as ProjectPropertyTypeEnum,
        pricingType: record.pricingType as PricingTypeEnum | null,
        mountingType: record.mountingType as MountingTypeEnum,
        revisionSize: record.revisionSize as OrderedServiceSizeForRevisionEnum | null,
        jobStatus: record.jobStatus as JobStatusEnum,
        jobRequestNumber: record.jobRequestNumber,
        propertyFullAddress: record.propertyAddress,
        deliverablesEmails: record.deliverablesEmail?.split(',') || [],
        jobName: record.jobName,
        assignedTasks: assignedTasks || [],
        orderedServices: orderedServices,
        systemSize: record.systemSize === null ? null : Number(record.systemSize),
        mailingAddressForWetStamp: this.isAddressValid(record)
          ? new Address({
              city: record.mailingAdderssCity!,
              country: record.mailingAdderssPostalCountry,
              postalCode: record.mailingAdderssPostalCode!,
              state: record.mailingAdderssState,
              street1: record.mailingAdderssStreet1!,
              street2: record.mailingAdderssStreet2,
              fullAddress: record.mailingFullAddressForWetStamp!,
              coordinates: record.mailingAdderssCoordinates!.split(',').map((n) => Number(n)),
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
        organizationId: record.clientOrganizationId,
        organizationName: record.clientOrganizationName,
        dateSentToClient: record.dateSentToClient,
        editorUserId: record.editor_user_id,
        isManualDueDate: record.isManualDueDate,
        inReview: record.inReview,
        priority: new Priority({
          priority: record.priority as OrderedJobsPriorityEnum,
        }),
        completedCancelledDate: record.completedCancelledDate,
        canceledAt: record.canceled_at,
        structuralUpgradeNote: record.structuralUpgradeNote,
        propertyOwner: record.propertyOwner,
      },
    })
  }

  toResponse(entity: JobEntity): JobResponseDto {
    return {} as JobResponseDto
  }

  private isAddressValid(job: OrderedJobs) {
    return (
      !!job.mailingAdderssCity &&
      !!job.mailingAdderssPostalCountry &&
      !!job.mailingAdderssPostalCode &&
      !!job.mailingAdderssState &&
      !!job.mailingAdderssStreet1 &&
      !!job.mailingFullAddressForWetStamp &&
      !!job.mailingAdderssCoordinates
    )
  }
}
