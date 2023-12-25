import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { AssigningTaskAlertProps, CreateAssigningTaskAlertProps } from './assigning-task-alert.type'

export class AssigningTaskAlertEntity extends AggregateRoot<AssigningTaskAlertProps> {
  protected _id: string

  static create(create: CreateAssigningTaskAlertProps) {
    const id: string = v4()
    const props: AssigningTaskAlertProps = {
      ...create,
      isCheckedOut: false,
    }

    const entity = new AssigningTaskAlertEntity({ id, props })
    return entity
  }

  checkOut() {
    this.props.isCheckedOut = true
    return this
  }

  public validate(): void {
    return
  }
}
