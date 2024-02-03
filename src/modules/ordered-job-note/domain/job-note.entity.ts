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

  get senderEmail(): string | null {
    return this.props.senderEmail
  }

  set senderEmail(senderEmail: string | null) {
    this.props.senderEmail = senderEmail
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

  get jobId(): string {
    return this.props.jobId
  }

  set jobId(jobId: string) {
    this.props.jobId = jobId
  }

  get jobNoteNumber(): number {
    return this.props.jobNoteNumber
  }

  set jobNoteNumber(jobNoteNumber: number) {
    this.props.jobNoteNumber = jobNoteNumber
  }

  get emailThreadId(): string | null {
    return this.props.emailThreadId
  }

  set emailThreadId(emailThreadId: string | null) {
    this.props.emailThreadId = emailThreadId
  }

  public validate(): void {
    return
  }
}
