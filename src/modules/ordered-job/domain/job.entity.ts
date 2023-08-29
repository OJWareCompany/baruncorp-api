import { v4 } from 'uuid'
import { AggregateID } from '../../../libs/ddd/entity.base'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { JobCreatedDomainEvent } from './events/job-created.domain-event'
import { CreateJobProps, JobProps, JobStatus } from './job.type'
import { CurrentJobUpdatedDomainEvent } from './events/current-job-updated.domain-event'
import { MountingType } from '@src/modules/project/domain/project.type'

export class JobEntity extends AggregateRoot<JobProps> {
  protected _id: AggregateID

  static create(create: CreateJobProps): JobEntity {
    const id = v4()
    const props: JobProps = {
      ...create,
      jobStatus: 'Not Started',
      receivedAt: new Date(),
      orderedTasks: [],
    }
    const job = new JobEntity({ id, props })
    job.addEvent(
      new JobCreatedDomainEvent({
        aggregateId: id,
        projectId: create.projectId,
        orderedTasks: create.orderedTasks.map((task) => {
          return { taskId: task.taskId, description: task.description }
        }),
        systemSize: create.systemSize,
        mailingAddressForWetStamp: create.mailingAddressForWetStamp,
        mountingType: create.mountingType as MountingType,
      }),
    )
    return job
  }

  updateNumberOfWetStamp(numberOfWetStamp: number) {
    this.props.numberOfWetStamp = numberOfWetStamp
    return
  }

  updateJobNumber(jobNumber: string) {
    this.props.jobNumber = jobNumber
    return
  }

  updateAdditionalInformationFromClient(additionalInformationFromClient: string) {
    this.props.additionalInformationFromClient = additionalInformationFromClient
    return
  }

  updateUpdatedBy(updatedBy: string) {
    this.props.updatedBy = updatedBy
    return
  }

  updateJobStatus(status: JobStatus) {
    this.props.jobStatus = status
    return this
  }

  updateSystemSize(systemSize: number): JobEntity {
    this.props.systemSize = systemSize
    return this
  }

  updateMailingAddressWetForStamp(mailingAddressForWetStamp: string): JobEntity {
    this.props.mailingAddressForWetStamp = mailingAddressForWetStamp
    return this
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

  eventForCurrentJobUpdate(): void {
    if (!this.props.isCurrentJob) return

    this.clearEvents()
    this.addEvent(
      new CurrentJobUpdatedDomainEvent({
        aggregateId: this.id,
        projectId: this.props.projectId,
        systemSize: this.props.systemSize,
        mailingAddressForWetStamp: this.props.mailingAddressForWetStamp,
        jobStatus: this.props.jobStatus,
        mountingType: this.props.mountingType as MountingType,
      }),
    )
  }

  public validate(): void {
    // throw new Error('Method not implemented.')
  }
}
