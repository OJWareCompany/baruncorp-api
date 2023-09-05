import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'

export interface JobNoteProps {
  content: string
  jobId: string
  commenterName: string
  commenterUserId: string
}

export interface CreateJobNoteProps {
  content: string
  jobId: string
  commenterName: string
  commenterUserId: string
}

export class JobNoteEntity extends AggregateRoot<JobNoteProps> {
  protected _id: string

  static create(create: CreateJobNoteProps) {
    const id = v4()
    const props: JobNoteProps = { ...create }
    return new JobNoteEntity({ id, props })
  }

  public validate(): void {
    const result = 1 + 1
  }
}
