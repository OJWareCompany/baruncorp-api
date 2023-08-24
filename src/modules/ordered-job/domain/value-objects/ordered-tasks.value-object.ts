export class OrderedTasksValueObject {
  taskIds: string[]
  otherTaskDescription: string
  constructor(props: OrderedTasksValueObject) {
    this.taskIds = props.taskIds
    this.otherTaskDescription = props.otherTaskDescription
  }
}
