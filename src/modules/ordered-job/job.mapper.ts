import { JobEntity } from './domain/job.entity'
import { OrderedJobs } from '@prisma/client'
import { JobResponseDto } from './dtos/job.response.dto'
import { Injectable } from '@nestjs/common'
import { Mapper } from '../../libs/ddd/mapper.interface'

@Injectable()
export class JobMapper implements Mapper<JobEntity, OrderedJobs, JobResponseDto> {
  toPersistence(entity: JobEntity): OrderedJobs {
    const props = entity.getProps()
    return {
      id: props.id,
      jobName: props.jobName,
      jobStatus: props.jobStatus,
      additionalInformationFromClient: props.additionalInformationFromClient,
      clientId: props.clientInfo.clientId,
      clientContact: props.clientInfo.clientContact,
      clientContactEmail: props.clientInfo.clientContactEmail,
      commercialJobPrice: null, //new Prisma.Decimal(props.commercialJobPrice),
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
      receivedAt: props.receivedAt,

      deliverablesEmail: props.clientInfo.deliverablesEmail,
      updatedBy: props.updatedBy,

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

  toDomain(record: OrderedJobs, ...entity: any): JobEntity {
    throw new Error('Method not implemented.')
  }

  toResponse(entity: JobEntity, ...dtos: any): JobResponseDto {
    throw new Error('Method not implemented.')
  }
}
