import { JobStatus, JobStatusEnum } from '../job.type'

export class DoneRequiredStatuses {
  private readonly _value = [JobStatusEnum.Canceled, JobStatusEnum.Canceled_Invoice, JobStatusEnum.Completed]

  get value(): JobStatus[] {
    return this._value
  }
}
