export class UpdateJobCommand {
  jobId: string
  jobNumber: string | null
  systemSize: number | null // Job 단위로 청구되며, 가격이 있기에 Size도 Job에 있어야 하지 않을까? (전체 사이즈는 프로젝트 하나라고하더라도..)
  mailingAddressForWetStamp: string
  deliverablesEmails: string[]
  clientUserIds: string[]
  additionalInformationFromClient: string
  numberOfWetStamp: number
  updatedByUserId: string
  jobStatus: string
  mountingType: string

  constructor(props: UpdateJobCommand) {
    this.deliverablesEmails = props.deliverablesEmails
    this.updatedByUserId = props.updatedByUserId
    this.jobNumber = props.jobNumber
    this.clientUserIds = props.clientUserIds
    this.additionalInformationFromClient = props.additionalInformationFromClient
    this.systemSize = props.systemSize
    this.jobId = props.jobId
    this.mailingAddressForWetStamp = props.mailingAddressForWetStamp
    this.mountingType = props.mountingType
  }
}
