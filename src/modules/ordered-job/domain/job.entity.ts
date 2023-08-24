import { v4 } from 'uuid'
import { AggregateID } from '../../../libs/ddd/entity.base'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { JobCreatedDomainEvent } from './events/job-created.domain-event'
import { CreateJobProps, JobProps } from './job.type'

export class JobEntity extends AggregateRoot<JobProps> {
  protected _id: AggregateID

  static create(create: CreateJobProps): JobEntity {
    const id = v4()
    const props: JobProps = { ...create, jobStatus: 'Not Started', receivedAt: new Date() }
    const job = new JobEntity({ id, props })
    job.addEvent(
      new JobCreatedDomainEvent({
        aggregateId: id,
        projectId: create.projectId,
        orderedTaskIds: create.orderedTasks.taskIds,
        otherServiceDescription: create.orderedTasks.otherTaskDescription,
      }),
    )
    return job
  }

  public validate(): void {
    // throw new Error('Method not implemented.')
  }
}
