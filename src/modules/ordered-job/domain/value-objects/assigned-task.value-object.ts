import { AssignedTaskStatus } from '../../../assigned-task/domain/assigned-task.type'
import { ValueObject } from '../../../../libs/ddd/value-object.base'

export class NewOrderedServices {
  serviceId: string
  serviceName: string
  description: string | null
  constructor(props: NewOrderedServices) {
    this.serviceId = props.serviceId
    this.description = props.description
  }
}

interface AssignedTaskProps {
  assignTaskId: string
  status: AssignedTaskStatus
  taskName: string
  taskId: string
  orderedServiceId: string
  jobId: string
  startedAt: Date | null
  assigneeName: string | null
  assigneeId: string | null
  doneAt: Date | null
  description: string | null
  duration: number | null
  isActive: boolean
}

export class AssignedTask extends ValueObject<AssignedTaskProps> {
  get assignTaskId(): string {
    return this.props.assignTaskId
  }

  get status(): AssignedTaskStatus {
    return this.props.status
  }

  get taskName(): string {
    return this.props.taskName
  }

  get taskId(): string {
    return this.props.taskId
  }

  get orderedServiceId(): string {
    return this.props.orderedServiceId
  }

  get jobId(): string {
    return this.props.jobId
  }

  get startedAt(): Date | null {
    return this.props.startedAt
  }

  get assigneeName(): string | null {
    return this.props.assigneeName
  }

  get assigneeId(): string | null {
    return this.props.assigneeId
  }

  get doneAt(): Date | null {
    return this.props.doneAt
  }

  get description(): string | null {
    return this.props.description
  }

  get duration(): number | null {
    return this.props.duration
  }

  get isActive(): boolean {
    return this.props.isActive
  }

  protected validate(props: AssignedTask): void {
    return
  }
}
