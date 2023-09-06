class OrderedTaskWhenToCreateJob {
  taskId: string
  description: string
}
export class CreateJobCommand {
  readonly deliverablesEmails: string[]
  readonly updatedByUserId: string
  readonly clientUserId: string
  readonly additionalInformationFromClient: string | null
  readonly systemSize: number | null // Job 단위로 청구되며, 가격이 있기에 Size도 Job에 있어야 하지 않을까? (전체 사이즈는 프로젝트 하나라고하더라도..)
  readonly projectId: string
  readonly orderedTasks: OrderedTaskWhenToCreateJob[] // 주문받은 태스크는 내부에서 실제 수행되는 여러가지 태스크들로 쪼개진다.
  readonly mailingAddressForWetStamp: string | null
  readonly numberOfWetStamp: number | null
  readonly mountingType: string

  constructor(props: CreateJobCommand) {
    Object.entries(props).map(([key, value]) => (this[key] = value))
  }
}
