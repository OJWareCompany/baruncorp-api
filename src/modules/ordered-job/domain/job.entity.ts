import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { AggregateID } from '../../../libs/ddd/entity.base'
import { MountingType, MountingTypeEnum, ProjectPropertyTypeEnum } from '../../project/domain/project.type'
import { OrderedServiceSizeForRevisionEnum } from '../../ordered-service/domain/ordered-service.type'
import { PricingTypeEnum } from '../../invoice/dtos/invoice.response.dto'
import { UserEntity } from '../../users/domain/user.entity'
import { Address } from '../../organization/domain/value-objects/address.vo'
import {
  AutoOnlyJobStatusEnum,
  CreateJobProps,
  JobProps,
  JobStatusEnum,
  LoadCalcOriginEnum,
  OrderedJobsPriorityEnum,
} from './job.type'
import { JobCanceledAndKeptInvoiceDomainEvent } from './events/job-canceled-and-kept-invoice.domain-event'
import { CurrentJobUpdatedDomainEvent } from './events/current-job-updated.domain-event'
import { OrderStatusChangeValidator } from './domain-services/order-status-change-validator.domain-service'
import { OrderModificationValidator } from './domain-services/order-modification-validator.domain-service'
import { JobNotStartedDomainEvent } from './events/job-not-started.domain-event'
import { JobCompletedDomainEvent } from './events/job-completed.domain-event'
import { JobCanceledDomainEvent } from './events/job-canceled.domain-event'
import { OrderDeletionValidator } from './domain-services/order-deletion-validator.domain-service'
import { JobStartedDomainEvent } from './events/job-started.domain-event'
import { JobDeletedDomainEvent } from './events/job-deleted.domain-event'
import { JobCreatedDomainEvent } from './events/job-created.domain-event'
import { JobHeldDomainEvent } from './events/job-held.domain-event'
import { ClientInformation } from './value-objects/client-information.value-object'
import {
  JobMissingDeliverablesEmailException,
  NumberOfWetStampBadRequestException,
  SystemSizeBadRequestException,
} from './job.error'
import { IRFIMail, RFIMailer } from '../../ordered-job-note/infrastructure/mailer.infrastructure'
import { JobProjectPropertyTypeUpdatedDomainEvent } from './events/job-project-property-type-updated.domain-event'
import { JobSystemSizeUpdatedDomainEvent } from './events/job-system-size-updated.domain-event'
import { JobMountingTypeUpdatedDomainEvent } from './events/job-mounting-type-updated.domain-event'
import { JobExpeditedStatusUpdatedDomainEvent } from './events/job-expedited-status-updated.domain-event'

export class JobEntity extends AggregateRoot<JobProps> {
  protected _id: AggregateID

  static create(create: CreateJobProps): JobEntity {
    const id = v4()
    const props: JobProps = {
      ...create,
      invoiceId: null,
      revisionSize: null,
      jobRequestNumber: ++create.totalOfJobs,
      propertyFullAddress: create.propertyFullAddress,
      jobName: `Job #${create.totalOfJobs} ` + create.propertyFullAddress,
      jobStatus: JobStatusEnum.Not_Started,
      receivedAt: new Date(),
      assignedTasks: [],
      orderedServices: [],
      pricingType: null,
      dateSentToClient: null,
      isManualDueDate: !!create.dueDate,
      inReview: false,
      priority: OrderedJobsPriorityEnum.Medium,
      completedCancelledDate: null,
    }

    const job = new JobEntity({ id, props })

    job.addEvent(
      new JobCreatedDomainEvent({
        aggregateId: id,
        organizationId: create.organizationId,
        organizationName: create.organizationName,
        projectId: create.projectId,
        services: create.orderedServices,
        systemSize: create.systemSize,
        mailingAddressForWetStamp: create.mailingAddressForWetStamp,
        mountingType: create.mountingType as MountingTypeEnum,
        projectType: create.projectPropertyType as ProjectPropertyTypeEnum,
        editorUserId: create.editorUserId,
      }),
    )
    return job
  }

  get jobStatus() {
    return this.props.jobStatus
  }

  get deliverablesEmails() {
    return this.props.deliverablesEmails
  }

  get jobName() {
    return this.props.jobName
  }

  get organizationId() {
    return this.props.organizationId
  }

  get organizationName() {
    return this.props.organizationName
  }

  get invoiceId() {
    return this.props.invoiceId
  }

  get projectId() {
    return this.props.projectId
  }

  get projectPropertyType() {
    return this.props.projectPropertyType
  }

  get mountingType() {
    return this.props.mountingType
  }

  get systemSize() {
    return this.props.systemSize
  }

  get pricingType() {
    return this.props.pricingType
  }

  get subtotal(): number {
    return this.props.orderedServices.reduce((pre, cur) => {
      const price = cur.price ?? 0
      return pre + price
    }, 0)
  }

  get total(): number {
    return this.props.orderedServices.reduce((pre, cur) => {
      const price = (cur.priceOverride || cur.price) ?? 0
      return pre + price
    }, 0)
  }

  get discountAmount(): number {
    return this.subtotal - this.total
  }

  get billingCodes(): string[] {
    return this.props.orderedServices.map((orderedService) => orderedService.billingCode)
  }

  isSendableOrThrow() {
    if (!this.props.deliverablesEmails.length) {
      throw new JobMissingDeliverablesEmailException()
    }
  }

  async sendToClient(
    editor: UserEntity,
    mailer: RFIMailer,
    deliverablesLink: string,
    orderStatusChangeValidator: OrderStatusChangeValidator,
  ) {
    await orderStatusChangeValidator.validateJob(this, AutoOnlyJobStatusEnum.Sent_To_Client)

    const input: IRFIMail = {
      subject: `BarunCorp Deliverables`,
      text: `deliverables link: ${deliverablesLink}`,
      from: 'automation@baruncorp.com',
      to: this.props.deliverablesEmails,
      threadId: null,
      files: null,
    }

    await mailer.sendRFI(input)
    if (this.props.jobStatus !== JobStatusEnum.Canceled_Invoice) {
      this.props.jobStatus = AutoOnlyJobStatusEnum.Sent_To_Client
    }
    this.props.updatedBy = editor.userName.fullName
    this.props.dateSentToClient = new Date()
    return this
  }

  updateRevisionSize() {
    const sizeForRevision = this.props.orderedServices.find(
      (orderedService) =>
        orderedService.isRevision && orderedService.sizeForRevision === OrderedServiceSizeForRevisionEnum.Major,
    )
      ? OrderedServiceSizeForRevisionEnum.Major
      : this.props.orderedServices.find(
          (orderedService) =>
            orderedService.isRevision && orderedService.sizeForRevision === OrderedServiceSizeForRevisionEnum.Minor,
        )
      ? OrderedServiceSizeForRevisionEnum.Minor
      : null
    this.props.revisionSize = sizeForRevision
    return this
  }

  async backToNotStart(
    orderStatusChangeValidator: OrderStatusChangeValidator,
    orderModificationValidator: OrderModificationValidator,
  ): Promise<this> {
    await orderModificationValidator.validateJob(this)
    await orderStatusChangeValidator.validateJob(this, JobStatusEnum.Not_Started)
    this.props.jobStatus = JobStatusEnum.Not_Started
    this.addEvent(new JobNotStartedDomainEvent({ aggregateId: this.id }))
    return this
  }

  start(): this {
    this.props.jobStatus = JobStatusEnum.In_Progress
    this.addEvent(new JobStartedDomainEvent({ aggregateId: this.id }))
    return this
  }

  complete(): this {
    this.props.jobStatus = JobStatusEnum.Completed
    this.props.completedCancelledDate = new Date()
    this.addEvent(
      new JobCompletedDomainEvent({
        aggregateId: this.id,
      }),
    )
    return this
  }

  cancel(): this {
    this.props.jobStatus = JobStatusEnum.Canceled
    this.props.completedCancelledDate = new Date()
    this.addEvent(new JobCanceledDomainEvent({ aggregateId: this.id }))
    return this
  }

  cancelAndKeepInvoice(): this {
    this.props.jobStatus = JobStatusEnum.Canceled_Invoice
    this.props.completedCancelledDate = new Date()
    this.addEvent(new JobCanceledAndKeptInvoiceDomainEvent({ aggregateId: this.id }))
    return this
  }

  hold(user: UserEntity): this {
    this.props.updatedBy = user.userName.fullName
    this.props.jobStatus = JobStatusEnum.On_Hold
    this.addEvent(new JobHeldDomainEvent({ aggregateId: this.id }))
    return this
  }

  applyTieredPricing() {
    this.props.pricingType = PricingTypeEnum.Tiered
    return this
  }

  invoice(invoiceId: string) {
    this.props.invoiceId = invoiceId
    if (this.props.jobStatus === JobStatusEnum.Canceled) {
      this.props.jobStatus = JobStatusEnum.Canceled_Invoice
    }
    return this
  }

  updatePropertyAddress(propertyFullAddress: string) {
    this.props.propertyFullAddress = propertyFullAddress
    this.props.jobName = `Job #${this.props.jobRequestNumber} ${propertyFullAddress}`
  }

  hasCurrentMailingAddress(): boolean {
    // return props.jobStatus === 'Completed' && !!props.mailingAddressForWetStamp?.coordinates?.length
    return !!this.getProps().mailingAddressForWetStamp?.coordinates.length
  }

  updateNumberOfWetStamp(numberOfWetStamp: number | null) {
    if (numberOfWetStamp && numberOfWetStamp > 255) throw new NumberOfWetStampBadRequestException()
    this.props.numberOfWetStamp = numberOfWetStamp
    return
  }

  updateAdditionalInformationFromClient(additionalInformationFromClient: string | null) {
    this.props.additionalInformationFromClient = additionalInformationFromClient
    return
  }

  setPriority(priority: OrderedJobsPriorityEnum) {
    this.props.priority = priority
    return this
  }

  setStructuralUpgradeNote(structuralUpgradeNote: string | null) {
    this.props.structuralUpgradeNote = structuralUpgradeNote
    return this
  }

  setLoadCalcOrigin(loadCalcOrigin: LoadCalcOriginEnum) {
    this.props.loadCalcOrigin = loadCalcOrigin
    return this
  }

  setInReview(inReview: boolean) {
    return (this.props.inReview = inReview)
  }

  updateDueDate(dueDate: Date) {
    this.props.dueDate = dueDate
    return this
  }

  updateUpdatedBy(editor: UserEntity) {
    this.props.updatedBy = editor.userName.fullName
    return this
  }

  updateSystemSize(systemSize: number | null): JobEntity {
    if (systemSize && 99999999.99999999 < systemSize) throw new SystemSizeBadRequestException()
    this.props.systemSize = systemSize
    if (systemSize !== null) {
      this.addEvent(new JobSystemSizeUpdatedDomainEvent({ aggregateId: this.id, systemSize: systemSize }))
    }
    return this
  }

  updateIsExpedited(isExpedited: boolean): JobEntity {
    this.props.isExpedited = isExpedited
    this.addEvent(
      new JobExpeditedStatusUpdatedDomainEvent({ aggregateId: this.id, isExpedited: this.props.isExpedited }),
    )
    return this
  }

  updateMailingAddressWetForStamp(mailingAddressForWetStamp: Address | null): JobEntity {
    this.props.mailingAddressForWetStamp = mailingAddressForWetStamp
    return this
  }

  updateDeliverablesEmails(deliverablesEmails: string[]): JobEntity {
    this.props.deliverablesEmails = deliverablesEmails
    return this
  }

  updateClientInfo(clientInfo: ClientInformation): JobEntity {
    this.props.clientInfo = clientInfo
    return this
  }

  updateMountingType(mountingType: MountingTypeEnum): JobEntity {
    this.props.mountingType = mountingType
    this.addEvent(
      new JobMountingTypeUpdatedDomainEvent({
        aggregateId: this.id,
        mountingType: mountingType,
      }),
    )
    return this
  }

  updateProjectPropertyType(projectPropertyType: ProjectPropertyTypeEnum, systemSize: number | null) {
    this.props.projectPropertyType = projectPropertyType
    this.addEvent(
      new JobProjectPropertyTypeUpdatedDomainEvent({
        aggregateId: this.id,
        projectPropertyType: this.props.projectPropertyType,
      }),
    )
    this.props.systemSize = systemSize // 시스템 사이즈 수정 업데이트는 하지 않는다. (property type 수정 이벤트에서 필요한 작업 처리), 현재는 이 메서드를 쓰는 Application Service에서 처리됨
    return this
  }

  isOnHold(): boolean {
    return this.props.jobStatus === 'On Hold'
  }

  isCompleted(): boolean {
    return this.props.jobStatus === 'Completed'
  }

  /**
   * 모든 필드에 대해서 update method를 만들면
   * 거의 모든 method에서 updated event를 이벤트 리스트에 추가해야한다.
   * 그러면 그만큼 많은 이벤트가 발생한다.
   *
   * 모든 method의 마지막에 이벤트 clear후 새로 업데이트 이벤트를 추가한다고하면
   * 오직 업데이트 이벤트만 남게된다.
   *
   * 업데이트 이벤트 하나로 다 처리해야하는가? 아니면 필드마다 업데이트 이베트를 추가해야하는가?
   */

  addUpdateEvent(): void {
    this.addEvent(
      new CurrentJobUpdatedDomainEvent({
        aggregateId: this.id,
        projectId: this.props.projectId,
        systemSize: this.props.systemSize,
        mailingFullAddressForWetStamp: this.props.mailingAddressForWetStamp?.fullAddress || null,
        jobStatus: this.props.jobStatus,
        mountingType: this.props.mountingType as MountingType,
        // assignedTasks: this.props.assignedTasks.map(task => {
        //   return new NewOrderedServices({
        //     serviceId: task.
        //   })
        // }),
        isCurrentJop: this.props?.isCurrentJob || false,
      }),
    )
  }

  async delete(modificationValidator: OrderModificationValidator, deletionValidator: OrderDeletionValidator) {
    await deletionValidator.validate(this)
    await modificationValidator.validateJob(this)
    this.addEvent(
      new JobDeletedDomainEvent({
        aggregateId: this.id,
        jobId: this.id,
        editorUserId: this.props.editorUserId,
        deletedAt: new Date(),
      }),
    )
    return this
  }

  public validate(): void {
    if (this.props.systemSize && this.props.systemSize > 99999999.99999999) {
      throw new SystemSizeBadRequestException()
    }
    if (this.props.numberOfWetStamp && this.props.numberOfWetStamp > 255) {
      throw new NumberOfWetStampBadRequestException()
    }
  }
}
