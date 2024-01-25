import { Inject, Injectable } from '@nestjs/common'
import { OrderedJobs } from '@prisma/client'
import { PrismaService } from '../database/prisma.service'
import { ServiceInitialPriceManager } from '../ordered-service/domain/ordered-service-manager.domain-service'
import { OrderedServiceSizeForRevisionEnum } from '../ordered-service/domain/ordered-service.type'
import { JobResponseDto } from './dtos/job.response.dto'
import { MountingTypeEnum, ProjectPropertyTypeEnum } from '../project/domain/project.type'
import { JobStatusEnum, LoadCalcOriginEnum } from './domain/job.type'
import { Address } from '../organization/domain/value-objects/address.vo'
import { PricingTypeEnum } from '../invoice/dtos/invoice.response.dto'
import { JobRepositoryPort } from './database/job.repository.port'
import { JOB_REPOSITORY } from './job.di-token'
/* eslint-disable @typescript-eslint/ban-ts-comment */

@Injectable()
export class JobResponseMapper {
  constructor(
    // @ts-ignore
    @Inject(JOB_REPOSITORY) private readonly jobRepo: JobRepositoryPort,
    private readonly prismaService: PrismaService,
    private readonly serviceManager: ServiceInitialPriceManager,
  ) {}
  async toResponse(job: OrderedJobs): Promise<JobResponseDto> {
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
          pricingType: await this.serviceManager.determinePricingType(scope),
          isRevision: scope.isRevision,
          description: scope.description,
          price: scope.price ? Number(scope.price) : null,
          priceOverride: scope.priceOverride ? Number(scope.priceOverride) : null,
          status: scope.status!,
          orderedAt: scope.orderedAt.toISOString(),
          doneAt: scope.doneAt ? scope.doneAt.toISOString() : null,
        }
      }),
    )
    const assignedTasks = await this.prismaService.assignedTasks.findMany({ where: { jobId: job.id } })
    const assignedTasksResponse = await Promise.all(
      assignedTasks.map(async (assignedTask) => {
        const prerequisiteTasks = await this.prismaService.prerequisiteTasks.findMany({
          where: { taskId: assignedTask.taskId },
        })
        return {
          assignTaskId: assignedTask.id,
          status: assignedTask.status,
          taskName: assignedTask.taskName,
          duration: assignedTask.duration,
          startedAt: assignedTask.startedAt ? assignedTask.startedAt.toISOString() : null,
          doneAt: assignedTask.doneAt ? assignedTask.doneAt.toISOString() : null,
          isActive: assignedTask.is_active,
          prerequisiteTasks: prerequisiteTasks,
          taskId: assignedTask.taskId,
          orderedServiceId: assignedTask.orderedServiceId,
          assigneeName: assignedTask.assigneeName,
          assigneeId: assignedTask.assigneeId,
          description: assignedTask.description,
        }
      }),
    )

    const subtotal = await this.jobRepo.getSubtotalInvoiceAmount(job.id)
    const total = await this.jobRepo.getTotalInvoiceAmount(job.id)

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
      taskSubtotal: subtotal,
      state: stateName,
      dateSentToClient: job.dateSentToClient,
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
