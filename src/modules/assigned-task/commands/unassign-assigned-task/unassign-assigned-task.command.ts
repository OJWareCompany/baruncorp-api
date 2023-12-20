export class UnassignAssignedTaskCommand {
  readonly assignedTaskId: string
  constructor(props: UnassignAssignedTaskCommand) {
    this.assignedTaskId = props.assignedTaskId
  }
}
