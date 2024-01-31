import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { CreateJobNoteProps, JobNoteProps, JobNoteTypeEnum } from './job-note.type'

export class JobNoteEntity extends AggregateRoot<JobNoteProps> {
  receivingUserEmails(receivingUserEmails: any) {
    throw new Error('Method not implemented.')
  }
  protected _id: string

  static create(create: CreateJobNoteProps) {
    const id = v4()
    const props: JobNoteProps = {
      ...create,
      creatorUser: null,
    }
    return new JobNoteEntity({ id, props })
  }

  get type() {
    return this.props.type
  }

  get receiverEmails(): string[] | null {
    return this.props.receiverEmails
  }

  set receiverEmails(receiverEmails: string[] | null) {
    this.props.receiverEmails = receiverEmails
  }

  get content(): string {
    return this.props.content
  }

  set content(content: string) {
    this.props.content = content
  }

  get jobNoteNumber(): number {
    return this.props.jobNoteNumber
  }

  set jobNoteNumber(jobNoteNumber: number) {
    this.props.jobNoteNumber = jobNoteNumber
  }

  public validate(): void {
    return
  }
}
