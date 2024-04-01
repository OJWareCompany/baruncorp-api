import { OrderedJobs } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { JobStatusEnum, LoadCalcOriginEnum } from './domain/job.type'
import { MountingTypeEnum, ProjectPropertyTypeEnum } from '../project/domain/project.type'
import { AssignedTaskResponseDto } from '../assigned-task/dtos/assigned-task.response.dto'
import { PricingTypeEnum } from '../invoice/dtos/invoice.response.dto'
import { JobResponseDto } from './dtos/job.response.dto'
import { PrismaService } from '../database/prisma.service'
import { Address } from '../organization/domain/value-objects/address.vo'
import {
  OrderedScopeStatus,
  OrderedServicePricingTypeEnum,
  OrderedServiceSizeForRevisionEnum,
  OrderedServiceStatusEnum,
} from '../ordered-service/domain/ordered-service.type'
import { OrderedJobsPriorityEnum } from './domain/value-objects/priority.value-object'
/* eslint-disable @typescript-eslint/ban-ts-comment */

@Injectable()
export class JobResponseMapper {
  constructor(private readonly prismaService: PrismaService) {}
  async toResponse(job: OrderedJobs): Promise<JobResponseDto> {
    const jobFolder = await this.prismaService.googleJobFolder.findFirst({ where: { jobId: job.id } })
    // if (!jobFolder) throw new GoogleDriveJobFolderNotFoundException()

    const currentJobId = await this.prismaService.orderedJobs.findFirst({
      select: { id: true },
      where: { projectId: job.projectId },
      orderBy: { createdAt: 'desc' },
    })

    const orderedScopes = await this.prismaService.orderedServices.findMany({
      where: { jobId: job.id },
      include: { service: true },
    })

    const project = await this.prismaService.orderedProjects.findFirst({
      where: { id: job.projectId },
    })
    let stateName = 'unknown'
    if (project?.stateId) {
      const ahjnote = await this.prismaService.aHJNotes.findFirst({ where: { geoId: project.stateId } })
      stateName = ahjnote?.name || 'unknown'
    }

    const eeChangeScope = orderedScopes.find((scope) => {
      return scope.service.billingCode === 'E3' && scope.isRevision
    })

    const structuralRevisionScope = orderedScopes.find((scope) => {
      return scope.service.billingCode === 'S4' && scope.isRevision
    })

    const designRevisionScope = orderedScopes.find((scope) => {
      return scope.service.billingCode === 'PV' && scope.isRevision
    })

    const orderedScopesResponse = await Promise.all(
      orderedScopes.map(async (scope) => {
        return {
          orderedServiceId: scope.id,
          serviceId: scope.serviceId,
          sizeForRevision: scope.sizeForRevision as OrderedServiceSizeForRevisionEnum | null,
          serviceName: scope.serviceName,
          pricingType: scope.pricing_type as OrderedServicePricingTypeEnum,
          isRevision: scope.isRevision,
          description: scope.description,
          price: scope.price ? Number(scope.price) : null,
          priceOverride: scope.priceOverride ? Number(scope.priceOverride) : null,
          status: scope.status as OrderedScopeStatus,
          orderedAt: scope.orderedAt.toISOString(),
          doneAt: scope.doneAt ? scope.doneAt.toISOString() : null,
        }
      }),
    )
    const assignedTasks = await this.prismaService.assignedTasks.findMany({ where: { jobId: job.id } })
    const assignedTasksResponse: AssignedTaskResponseDto[] = await Promise.all(
      assignedTasks.map(async (assignedTask) => {
        const prerequisiteTasks = await this.prismaService.prerequisiteTasks.findMany({
          where: { taskId: assignedTask.taskId },
        })
        return new AssignedTaskResponseDto({
          id: assignedTask.id,
          taskId: assignedTask.taskId,
          orderedServiceId: assignedTask.orderedServiceId,
          jobId: assignedTask.jobId,
          status: assignedTask.status,
          description: assignedTask.description,
          assigneeId: assignedTask.assigneeId,
          assigneeName: assignedTask.assigneeName,
          assigneeOrganizationId: assignedTask.assigneeOrganizationId,
          assigneeOrganizationName: assignedTask.assigneeOrganizationName,
          duration: assignedTask.duration ? Number(assignedTask.duration) : null,
          startedAt: assignedTask.startedAt,
          doneAt: assignedTask.doneAt,
          taskName: assignedTask.taskName,
          serviceName: assignedTask.serviceName,
          projectId: assignedTask.projectId,
          organizationId: assignedTask.organizationId,
          organizationName: assignedTask.organizationName,
          projectPropertyType: assignedTask.projectPropertyType as ProjectPropertyTypeEnum,
          mountingType: assignedTask.mountingType as MountingTypeEnum,
          cost: assignedTask.cost ? Number(assignedTask.cost) : null,
          isManualCost: assignedTask.isManualCost,
          isVendor: assignedTask.isVendor,
          vendorInvoiceId: assignedTask.vendorInvoiceId,
          serviceId: assignedTask.serviceId,
          createdAt: assignedTask.created_at,
          prerequisiteTasks: prerequisiteTasks,
          jobDescription: assignedTask.jobName,
        })
      }),
    )

    const total = orderedScopes //
      .filter(
        (scope) =>
          scope.status === OrderedServiceStatusEnum.Completed ||
          scope.status === OrderedServiceStatusEnum.Canceled_Invoice,
      )
      .reduce((pre, cur) => pre + Number(cur.price), 0)

    return new JobResponseDto({
      id: job.id,
      projectId: job.projectId,
      projectPropertyType: job.projectType as ProjectPropertyTypeEnum,
      systemSize: job.systemSize ? Number(job.systemSize) : null,
      mountingType: job.mountingType as MountingTypeEnum,
      numberOfWetStamp: job.numberOfWetStamp,
      additionalInformationFromClient: job.additionalInformationFromClient,
      updatedBy: job.updatedBy,
      jobRequestNumber: job.jobRequestNumber,
      jobStatus: job.jobStatus as JobStatusEnum,
      loadCalcOrigin: job.loadCalcOrigin as LoadCalcOriginEnum,
      receivedAt: job.receivedAt.toISOString(),
      isExpedited: job.isExpedited,
      jobName: job.jobName,
      clientInfo: {
        clientOrganizationId: job.clientOrganizationId,
        clientOrganizationName: job.clientOrganizationName,
        clientUserId: job.clientUserId,
        clientUserName: job.clientUserName,
        contactEmail: job.clientContactEmail,
        deliverablesEmails: job.deliverablesEmail?.split(',') || [],
      },
      isContainsRevisionTask: !!orderedScopes.find((scope) => scope.isRevision),
      billingCodes: orderedScopes.map((scope) => scope.service.billingCode),
      revisionSize: job.revisionSize as OrderedServiceSizeForRevisionEnum,
      propertyFullAddress: job.propertyAddress,
      mailingAddressForWetStamp: this.isAddressValid(job)
        ? new Address({
            city: job.mailingAdderssCity!,
            country: job.mailingAdderssPostalCountry,
            postalCode: job.mailingAdderssPostalCode!,
            state: job.mailingAdderssState,
            street1: job.mailingAdderssStreet1!,
            street2: job.mailingAdderssStreet2,
            fullAddress: job.mailingFullAddressForWetStamp!,
            coordinates: job.mailingAdderssCoordinates!.split(',').map((n) => Number(n)),
          })
        : null,
      assignedTasks: assignedTasksResponse,
      orderedServices: orderedScopesResponse,
      isCurrentJob: job.id === currentJobId?.id,
      eeChangeScope: eeChangeScope ? (eeChangeScope.sizeForRevision as OrderedServiceSizeForRevisionEnum) : null,
      structuralRevisionScope: structuralRevisionScope
        ? (structuralRevisionScope.sizeForRevision as OrderedServiceSizeForRevisionEnum)
        : null,
      designRevisionScope: designRevisionScope
        ? (designRevisionScope.sizeForRevision as OrderedServiceSizeForRevisionEnum)
        : null,
      pricingType: job.pricingType as PricingTypeEnum,
      price: total,
      taskSubtotal: total,
      state: stateName,
      dateSentToClient: job.dateSentToClient,
      dueDate: job.dueDate ? job.dueDate : null,
      jobFolderId: jobFolder?.id ?? null,
      shareLink: jobFolder?.shareLink ?? null,
      inReview: job.inReview,
      priority: job.priority as OrderedJobsPriorityEnum,
      priorityLevel: job.priorityLevel,
      completedCancelledDate: job.completedCancelledDate,
      structuralUpgradeNote: job.structuralUpgradeNote,
      propertyOwner: job.propertyOwner!,
      projectNumber: job.project_number,
    })
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
