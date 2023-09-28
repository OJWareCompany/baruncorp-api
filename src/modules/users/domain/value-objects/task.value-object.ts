import { ValueObject } from '../../../../libs/ddd/value-object.base'

export interface TaskProps {
  id: string
  name: string
}

export class Task extends ValueObject<TaskProps> {
  protected validate(props: TaskProps): void {
    return
  }
}
