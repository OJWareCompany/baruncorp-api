import { v4 } from 'uuid'
import { BadRequestException } from '@nestjs/common'
import { AggregateID } from '../../../libs/ddd/entity.base'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { MountingType } from '../../project/domain/project.type'
import { TaskStatusEnum } from '../../ordered-task/domain/ordered-task.type'
import { Address } from '../../organization/domain/value-objects/address.vo'
import { CreateJobProps, JobProps, JobStatus } from './job.type'
import { JobCreatedDomainEvent } from './events/job-created.domain-event'
import { CurrentJobUpdatedDomainEvent } from './events/current-job-updated.domain-event'
import { ClientInformation } from './value-objects/client-information.value-object'
import { NumberOfWetStampBadRequestException } from './job.error'

export class JobEntity extends AggregateRoot<JobProps> {
  protected _id: AggregateID

  static create(create: CreateJobProps): JobEntity {
    const id = v4()
    const props: JobProps = {
      ...create,
      jobRequestNumber: ++create.totalOfJobs,
      propertyFullAddress: create.propertyFullAddress,
      jobName: `Job #${create.totalOfJobs} ` + create.propertyFullAddress,
      jobStatus: 'Not Started',
      receivedAt: new Date(),
      orderedTasks: [],
    }
    const job = new JobEntity({ id, props })
    job.addEvent(
      new JobCreatedDomainEvent({
        aggregateId: id,
        projectId: create.projectId,
        orderedTasks: create.orderedTasks,
        systemSize: create.systemSize,
        mailingAddressForWetStamp: create.mailingAddressForWetStamp,
        mountingType: create.mountingType as MountingType, // TODO: status any
      }),
    )
    return job
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
    if (numberOfWetStamp && numberOfWetStamp > 255) {
      throw new NumberOfWetStampBadRequestException()
    }
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

  updateJobStatus(status: JobStatus) {
    const hasOnHoldTask = this.props.orderedTasks.filter((task) => task.taskStatus === TaskStatusEnum.On_Hold).length
    const isAllTasksCompleted = this.props.orderedTasks.every((task) => task.taskStatus === TaskStatusEnum.Completed)
    if (status === 'Completed' && !isAllTasksCompleted) {
      throw new BadRequestException('There are uncompleted tasks.', '60001')
    } else if (status === 'Completed' && hasOnHoldTask) {
      throw new BadRequestException('There are holding tasks.', '60002')
    }
    this.props.jobStatus = status
    return this
  }

  updateSystemSize(systemSize: number | null): JobEntity {
    this.props.systemSize = systemSize
    return this
  }

  updateMailingAddressWetForStamp(mailingAddressForWetStamp: Address | null): JobEntity {
    this.props.mailingAddressForWetStamp = mailingAddressForWetStamp
    return this
  }

  updateJobStatusByTask(taskStatus: string): this {
    const hasOnHoldTask = this.props.orderedTasks.filter((task) => task.taskStatus === TaskStatusEnum.On_Hold).length
    const isAllCompleted = this.props.orderedTasks.every((task) => task.taskStatus === TaskStatusEnum.Completed)
    const isInProgress = taskStatus === 'In Progress'

    this.props.jobStatus = isInProgress //
      ? 'In Progress'
      : isAllCompleted
      ? 'Completed'
      : hasOnHoldTask
      ? 'On Hold'
      : this.props.jobStatus

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
        orderedTask: this.props.orderedTasks,
        isCurrentJop: this.props?.isCurrentJob || false,
      }),
    )
  }

  public validate(): void {
    // throw new Error('Method not implemented.')
  }
}
