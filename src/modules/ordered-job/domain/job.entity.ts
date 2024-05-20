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
  JobStatus,
  JobStatusEnum,
  LoadCalcOriginEnum,
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
  JobDueDateManualEntryException,
  JobDueDateNotUpdatedException,
  JobMissingDeliverablesEmailException,
  JobStatusNotUpdatedException,
  NumberOfWetStampBadRequestException,
  SystemSizeBadRequestException,
} from './job.error'
import { IRFIMail, RFIMailer } from '../../ordered-job-note/infrastructure/mailer.infrastructure'
import { JobProjectPropertyTypeUpdatedDomainEvent } from './events/job-project-property-type-updated.domain-event'
import { JobSystemSizeUpdatedDomainEvent } from './events/job-system-size-updated.domain-event'
import { JobMountingTypeUpdatedDomainEvent } from './events/job-mounting-type-updated.domain-event'
import { JobExpeditedStatusUpdatedDomainEvent } from './events/job-expedited-status-updated.domain-event'
import { JobSentToClientDomainEvent } from './events/job-sent-to-client.domain-event'
import { OrderedJobsPriorityEnum, Priority } from './value-objects/priority.value-object'
import { JobPriorityUpdatedDomainEvent } from './events/job-priority-updated.domain-event'
import { ConfigModule } from '@nestjs/config'
import { DetermineJobStatus } from './domain-services/determine-job-status.domain-service'
import { DoneRequiredStatuses } from './value-objects/completion-required-statuses.value-object'
import { TotalDurationCalculator } from './domain-services/total-duration-calculator.domain-service'
import { areDatesEqualIgnoringMilliseconds } from '../../../libs/utils/areDatesEqualIgnoringMilliseconds.util'
import { MakeDeliverablesEmailContents } from './domain-services/make-deliverables-email-contents.domain-service'

ConfigModule.forRoot()
const { APP_MODE } = process.env
export class JobEntity extends AggregateRoot<JobProps> {
  protected _id: AggregateID

  static create(create: CreateJobProps): JobEntity {
    const id = v4()
    const props: JobProps = {
      ...create,
      invoiceId: null,
      revisionSize: null,
      jobRequestNumber: ++create.totalOfJobs,
      canceledAt: null,
      propertyFullAddress: create.propertyFullAddress,
      jobName: `Job #${create.totalOfJobs} ` + create.propertyFullAddress,
      jobStatus: JobStatusEnum.Not_Started,
      receivedAt: new Date(),
      assignedTasks: [],
      orderedServices: [],
      pricingType: null,
      dateSentToClient: null,
      inReview: false,
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
        priority: create.priority,
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

  get priority() {
    return this.props.priority
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

  get dueDate() {
    return this.props.dueDate
  }

  get isManualDueDate() {
    return this.props.isManualDueDate
  }

  isSendableOrThrow() {
    if (!this.props.deliverablesEmails.length) {
      throw new JobMissingDeliverablesEmailException()
    }
  }

  async sendToClient(
    editor: UserEntity,
    mailContents: IRFIMail,
    mailer: RFIMailer,
    orderStatusChangeValidator: OrderStatusChangeValidator,
  ) {
    await orderStatusChangeValidator.validateJob(this, AutoOnlyJobStatusEnum.Sent_To_Client)

    await mailer.sendRFI(mailContents)

    if (this.props.jobStatus !== JobStatusEnum.Canceled_Invoice) {
      await this.setStatus(AutoOnlyJobStatusEnum.Sent_To_Client, null)
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
    calculator: TotalDurationCalculator,
  ): Promise<this> {
    await orderModificationValidator.validateJob(this)
    await orderStatusChangeValidator.validateJob(this, JobStatusEnum.Not_Started)
    await this.setStatus(JobStatusEnum.Not_Started, calculator)
    return this
  }

  async start(calculator: TotalDurationCalculator): Promise<this> {
    await this.setStatus(JobStatusEnum.In_Progress, calculator)
    return this
  }

  async determineCurrentStatusOrThrow(determineJobStatus: DetermineJobStatus, calculator: TotalDurationCalculator) {
    const resultStatus = await determineJobStatus.determineCurrentStatus(this)
    // Job의 상태가 변경되지 않는다면 이벤트를 발행하지 않기 위해 예외처리한다.
    if (this.props.jobStatus === resultStatus) {
      throw new JobStatusNotUpdatedException()
    }

    await this.setStatus(resultStatus, calculator)

    const isDone: JobStatus[] = new DoneRequiredStatuses().value
    if (isDone.includes(this.props.jobStatus)) {
      this.props.completedCancelledDate = new Date()
    }
    return this
  }

  async complete(calculator: TotalDurationCalculator): Promise<this> {
    await this.setStatus(JobStatusEnum.Completed, calculator)
    this.props.completedCancelledDate = new Date()
    return this
  }

  async cancel(): Promise<this> {
    await this.setStatus(JobStatusEnum.Canceled, null)
    this.props.completedCancelledDate = new Date()
    this.props.canceledAt = new Date()
    return this
  }

  async cancelAndKeepInvoice(): Promise<this> {
    await this.setStatus(JobStatusEnum.Canceled_Invoice, null)
    this.props.completedCancelledDate = new Date()
    this.props.canceledAt = new Date()
    return this
  }

  async hold(user: UserEntity): Promise<this> {
    this.props.updatedBy = user.userName.fullName
    await this.setStatus(JobStatusEnum.On_Hold, null)
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

  unInvoice() {
    this.props.invoiceId = null
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

  private async setStatus(status: JobStatus, calculator: TotalDurationCalculator | null) {
    switch (status) {
      case JobStatusEnum.Not_Started:
        if (!calculator) throw new Error('It needs calculator when status is updated.')
        try {
          await this.updateDueDateOrThrow({ calculator })
        } catch (error) {}
        this.addEvent(new JobNotStartedDomainEvent({ aggregateId: this.id }))
        break

      case JobStatusEnum.In_Progress:
        if (!calculator) throw new Error('It needs calculator when status is updated.')
        try {
          await this.updateDueDateOrThrow({ calculator })
        } catch (error) {}
        this.addEvent(new JobStartedDomainEvent({ aggregateId: this.id }))
        break

      case JobStatusEnum.Completed:
        if (!calculator) throw new Error('It needs calculator when status is updated.')
        try {
          await this.updateDueDateOrThrow({ calculator })
        } catch (error) {}
        this.addEvent(new JobCompletedDomainEvent({ aggregateId: this.id }))
        break

      case AutoOnlyJobStatusEnum.Sent_To_Client:
        this.addEvent(new JobSentToClientDomainEvent({ aggregateId: this.id }))
        break

      case JobStatusEnum.Canceled:
        this.addEvent(new JobCanceledDomainEvent({ aggregateId: this.id }))
        break

      case JobStatusEnum.Canceled_Invoice:
        this.addEvent(new JobCanceledAndKeptInvoiceDomainEvent({ aggregateId: this.id }))
        break

      case JobStatusEnum.On_Hold:
        this.addEvent(new JobHeldDomainEvent({ aggregateId: this.id }))
        break
    }

    this.props.jobStatus = status
    this.updatePriority()
    return this
  }

  /**
   * 여기서는 Job의 상태에 따라 계산하는 것을 하면 안될것 같은 느낌? 모르겠다..하
   */
  private updatePriority() {
    switch (this.props.jobStatus) {
      case JobStatusEnum.Not_Started:
        this.props.priority = this.calcPriority()
        break

      case JobStatusEnum.In_Progress:
        this.props.priority = this.calcPriority()
        break

      case JobStatusEnum.Completed:
        this.props.priority = this.calcPriority()
        break

      case AutoOnlyJobStatusEnum.Sent_To_Client:
        this.props.priority = new Priority({ priority: OrderedJobsPriorityEnum.None })
        break

      case JobStatusEnum.Canceled:
        this.props.priority = new Priority({ priority: OrderedJobsPriorityEnum.None })
        break

      case JobStatusEnum.Canceled_Invoice:
        this.props.priority = new Priority({ priority: OrderedJobsPriorityEnum.None })
        break

      case JobStatusEnum.On_Hold:
        this.props.priority = new Priority({ priority: OrderedJobsPriorityEnum.Low })
        break

      default:
        break
    }

    this.addEvent(new JobPriorityUpdatedDomainEvent({ aggregateId: this.id, priority: this.props.priority.name }))
    return this
  }

  private calcPriority(): Priority {
    if (!this.props.dueDate) return this.props.priority

    /**
     * 주문 시점을 기준으로 마감기한(주어진 작업 시간)을 계산한다.
     *
     * TODO: 추후에 due_date은 병렬 작업, 보류 기간이 고려되어 계산된 상태여야 한다.
     */
    const totalWorkingHours = (this.props.dueDate.getTime() - this.createdAt.getTime()) / (1000 * 60 * 60)

    // 주문 시점을 기준으로 작업이 진행된 시간을 계산한다.
    const now = new Date()
    const elapsedWorkingHours = (now.getTime() - this.createdAt.getTime()) / (1000 * 60 * 60)

    /**
     * 주어진 작업시간을 71% 이상 사용했다면
     * 마감 기한까지 29% 이하로 남았다면
     */
    if (elapsedWorkingHours >= 0.71 * totalWorkingHours) {
      return new Priority({ priority: OrderedJobsPriorityEnum.Immediate })
    } else if (elapsedWorkingHours >= 0.41 * totalWorkingHours) {
      return new Priority({ priority: OrderedJobsPriorityEnum.High })
    } else if (elapsedWorkingHours >= 0.21 * totalWorkingHours) {
      return new Priority({ priority: OrderedJobsPriorityEnum.Medium })
    } else {
      return new Priority({ priority: OrderedJobsPriorityEnum.Low })
    }
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

  // TODO: Update Priority
  async updateDueDateOrThrow(option: { calculator?: TotalDurationCalculator; manualDate?: Date }) {
    if (option.calculator) {
      if (this.props.isManualDueDate) {
        throw new JobDueDateManualEntryException()
      }
      this.setDueDate(await option.calculator.calcDueDate(this))
    } else if (option.manualDate) {
      this.props.isManualDueDate = true
      this.setDueDate(option.manualDate)
    }
    this.updatePriority()
    return this
  }

  private setDueDate(dueDate: Date) {
    if (this.props.dueDate) {
      const isSameDate = areDatesEqualIgnoringMilliseconds(this.props.dueDate, dueDate)
      if (isSameDate) {
        throw new JobDueDateNotUpdatedException()
      }
    }

    if (!this.props.dueDate && !dueDate) {
      throw new JobDueDateNotUpdatedException()
    }

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
