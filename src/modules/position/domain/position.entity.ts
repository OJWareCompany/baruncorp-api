import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { CreatePositionProps, PositionProps } from './position.type'
import { MaximumInvalidException } from './position.error'

export class PositionEntity extends AggregateRoot<PositionProps> {
  protected _id: string

  static create(create: CreatePositionProps) {
    const id = v4()
    const props: PositionProps = { ...create }
    return new PositionEntity({ id, props })
  }

  updateName(name: string) {
    this.props.name = name
    return this
  }

  updateMaxAssignedTasksLimit(maxAssignedTasksLimit: number | null) {
    if (maxAssignedTasksLimit && maxAssignedTasksLimit > 255) {
      throw new MaximumInvalidException()
    }
    this.props.maxAssignedTasksLimit = maxAssignedTasksLimit
    return this
  }

  public validate(): void {
    if (this.props.maxAssignedTasksLimit && this.props.maxAssignedTasksLimit > 255) {
      throw new MaximumInvalidException()
    }
    return
  }
}
