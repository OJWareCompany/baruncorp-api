import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { CreateTaskProps, TaskProps } from './task.type'

export class TaskEntity extends AggregateRoot<TaskProps> {
  protected _id: string

  static create(create: CreateTaskProps) {
    const id = v4()
    const props: TaskProps = { ...create }
    return new TaskEntity({ id, props })
  }

  public validate(): void {
    return
  }
}
