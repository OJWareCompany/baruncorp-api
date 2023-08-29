class OrderedTaskWhenToCreateJob {
  taskId: string
  description: string
}
export class CreateJobCommand {
  deliverablesEmails: string[]
  updatedByUserId: string
  jobNumber: string | null
  clientUserIds: string[]
  additionalInformationFromClient: string
  systemSize: number | null // Job 단위로 청구되며, 가격이 있기에 Size도 Job에 있어야 하지 않을까? (전체 사이즈는 프로젝트 하나라고하더라도..)
  projectId: string
  orderedTasks: OrderedTaskWhenToCreateJob[] // 주문받은 태스크는 내부에서 실제 수행되는 여러가지 태스크들로 쪼개진다.
  // otherServiceDescription: string
  mailingAddressForWetStamp: string
  numberOfWetStamp: number
  mountingType: string

  constructor(props: CreateJobCommand) {
    this.deliverablesEmails = props.deliverablesEmails
    this.updatedByUserId = props.updatedByUserId
    this.jobNumber = props.jobNumber
    this.clientUserIds = props.clientUserIds
    this.additionalInformationFromClient = props.additionalInformationFromClient
    this.systemSize = props.systemSize
    this.projectId = props.projectId
    this.orderedTasks = props.orderedTasks
    this.mailingAddressForWetStamp = props.mailingAddressForWetStamp
    this.mountingType = props.mountingType
  }
}
