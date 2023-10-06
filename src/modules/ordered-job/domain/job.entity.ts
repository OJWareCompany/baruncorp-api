import { v4 } from 'uuid'
import { AggregateID } from '../../../libs/ddd/entity.base'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { MountingType, ProjectPropertyType } from '../../project/domain/project.type'
import { Address } from '../../organization/domain/value-objects/address.vo'
import { CreateJobProps, JobProps } from './job.type'
import { JobCreatedDomainEvent } from './events/job-created.domain-event'
import { CurrentJobUpdatedDomainEvent } from './events/current-job-updated.domain-event'
import { ClientInformation } from './value-objects/client-information.value-object'
import {
  JobCompletedUpdateException,
  NumberOfWetStampBadRequestException,
  SystemSizeBadRequestException,
} from './job.error'
import { JobCompletedDomainEvent } from './events/job-completed.domain-event'
import { JobHeldDomainEvent } from './events/job-held.domain-event'
import { JobCanceledDomainEvent } from './events/job-canceled.domain-event'

export class JobEntity extends AggregateRoot<JobProps> {
  protected _id: AggregateID

  static create(create: CreateJobProps): JobEntity {
    const id = v4()
    const props: JobProps = {
      ...create,
      invoiceId: null,
      jobRequestNumber: ++create.totalOfJobs,
      propertyFullAddress: create.propertyFullAddress,
      jobName: `Job #${create.totalOfJobs} ` + create.propertyFullAddress,
      jobStatus: 'Not Started',
      receivedAt: new Date(),
      assignedTasks: [],
      orderedServices: [],
    }
    const job = new JobEntity({ id, props })
    job.addEvent(
      new JobCreatedDomainEvent({
        aggregateId: id,
        projectId: create.projectId,
        services: create.orderedServices,
        systemSize: create.systemSize,
        mailingAddressForWetStamp: create.mailingAddressForWetStamp,
        mountingType: create.mountingType as MountingType, // TODO: status any
        projectType: create.projectType as ProjectPropertyType,
      }),
    )
    return job
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

  notStart(): this {
    if (this.isCompleted()) throw new JobCompletedUpdateException()
    this.props.jobStatus = 'Not Started'
    return this
  }

  start(): this {
    if (this.isCompleted()) throw new JobCompletedUpdateException()
    this.props.jobStatus = 'In Progress'
    return this
  }

  complete(): this {
    if (!this.isAllTaskCompleted()) return this
    this.props.jobStatus = 'Completed'
    this.addEvent(
      new JobCompletedDomainEvent({
        aggregateId: this.id,
      }),
    )
    return this
  }

  isAllTaskCompleted(): boolean {
    return !this.props.assignedTasks.filter((task) => {
      return task.status === 'In Progress' || task.status === 'On Hold' || task.status === 'Not Started'
    }).length
  }

  cancel(): this {
    this.props.jobStatus = 'Canceled'
    this.addEvent(
      new JobCanceledDomainEvent({
        aggregateId: this.id,
      }),
    )
    return this
  }

  hold(): this {
    this.props.jobStatus = 'On Hold'
    this.addEvent(
      new JobHeldDomainEvent({
        aggregateId: this.id,
      }),
    )
    return this
  }

  updatePropetyAddress(propertyFullAddress: string) {
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

  updateUpdatedBy(updatedBy: string) {
    this.props.updatedBy = updatedBy
    return
  }

  updateSystemSize(systemSize: number | null): JobEntity {
    if (systemSize && 99999999.99999999 < systemSize) throw new SystemSizeBadRequestException()
    this.props.systemSize = systemSize
    return this
  }

  updateIsExpedited(isExpedited: boolean): JobEntity {
    this.props.isExpedited = isExpedited
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

  updateMountingType(mountingType: MountingType): JobEntity {
    this.props.mountingType = mountingType
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
        mountingType: this.props.mountingType as MountingType, // TODO: status any
        // assignedTasks: this.props.assignedTasks.map(task => {
        //   return new NewOrderedServices({
        //     serviceId: task.
        //   })
        // }),
        isCurrentJop: this.props?.isCurrentJob || false,
      }),
    )
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
