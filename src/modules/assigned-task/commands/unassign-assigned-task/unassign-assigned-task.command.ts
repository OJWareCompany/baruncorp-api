export class UnassignAssignedTaskCommand {
  readonly assignedTaskId: string
  readonly editorUserId: string
  constructor(props: UnassignAssignedTaskCommand) {
    this.assignedTaskId = props.assignedTaskId
  }
}
