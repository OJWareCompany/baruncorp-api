import { ValueObject } from '../../../../libs/ddd/value-object.base'
import { Task } from './task.value-object'

export interface ServiceProps {
  id: string
  name: string
  billingCode: string
  basePrice: number
  relatedTasks: Task[]
}

export class Service extends ValueObject<ServiceProps> {
  get id(): string {
    return this.props.id
  }

  get name(): string {
    return this.props.name
  }

  get billingCode(): string {
    return this.props.billingCode
  }

  get basePrice(): number {
    return this.props.basePrice
  }

  get relatedTasks(): Task[] {
    return this.props.relatedTasks
  }

  protected validate(props: ServiceProps): void {
    return
  }
}
