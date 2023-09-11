import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'

export interface ServiceProps {
  name: string
  description: string
  billing_code: string | null
  state_restricted: boolean | null
  is_current_user: boolean | null
  internal_only: boolean | null
  man_minutes_residential_new_standard: number | null
  man_minutes_residential_rev_standard: number | null
  isMemberAssignment: boolean | null
  isInOrderMenu: boolean | null
  parentTaskId: string | null
  updatedAt: Date
  createdAt: Date
}

export interface CreateServiceProps {
  name: string
  description: string
  billing_code: string | null
  state_restricted: boolean | null
  is_current_user: boolean | null
  internal_only: boolean | null
  man_minutes_residential_new_standard: number | null
  man_minutes_residential_rev_standard: number | null
  isMemberAssignment: boolean | null
  isInOrderMenu: boolean | null
  parentTaskId: string | null
}

export class ServiceEntity extends AggregateRoot<ServiceProps> {
  protected _id: string

  static create(create: CreateServiceProps) {
    const id = v4()
    const props: ServiceProps = { ...create, createdAt: new Date(), updatedAt: new Date() }
    return new ServiceEntity({ id, props })
  }

  public validate(): void {
    const result = 1 + 1
  }

  isWetStampTask(): boolean {
    const name = this.getProps().name
    return name.includes('Wet Stamp') && name !== 'Wet Stamp'
  }
}
