export class RejectAssignedTaskCommand {
  readonly assignedTaskId: string
  readonly reason: string
  readonly userId: string
  constructor(props: RejectAssignedTaskCommand) {
    this.assignedTaskId = props.assignedTaskId
  }
}
