import { v4 } from 'uuid'
import { AggregateID } from '../../../libs/ddd/entity.base'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { JobCreatedDomainEvent } from './events/job-created.domain-event'
import { CreateJobProps, JobProps } from './job.type'
import { CurrentJobUpdatedDomainEvent } from './events/current-job-updated.domain-event'

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
      }),
    )
    return job
  }

  update() {
    this.eventForCurrentJobUpdate()
  }

  updateSystemSize(systemSize: number): JobEntity {
    this.props.systemSize = systemSize
    this.eventForCurrentJobUpdate()
    return this
  }

  updateMailingAddressWetForStamp(mailingAddressForWetStamp: string): JobEntity {
    this.props.mailingAddressForWetStamp = mailingAddressForWetStamp
    this.eventForCurrentJobUpdate()
    return this
  }

  private eventForCurrentJobUpdate(): void {
    if (!this.props.isCurrentJob) return

    this.clearEvents()
    this.addEvent(
      new CurrentJobUpdatedDomainEvent({
        aggregateId: this.id,
        projectId: this.props.projectId,
        systemSize: this.props.systemSize,
        mailingAddressForWetStamp: this.props.mailingAddressForWetStamp,
      }),
    )
  }

  public validate(): void {
    // throw new Error('Method not implemented.')
  }
}
