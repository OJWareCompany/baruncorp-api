export class CreateJobCommand {
  deliverablesEmails: string[]

  updatedByUserId: string

  jobNumber: string | null

  clientUserIds: string[]

  additionalInformationFromClient: string

  systemSize: number | null // Job 단위로 청구되며, 가격이 있기에 Size도 Job에 있어야 하지 않을까? (전체 사이즈는 프로젝트 하나라고하더라도..)

  projectId: string

  taskIds: string[] // 주문받은 태스크는 내부에서 실제 수행되는 여러가지 태스크들로 쪼개진다.

  otherServiceDescription: string

  mailingAddressForWetStamp: {
    street1: string
    street2: string | null
    city: string
    state: string
    postalCode: string
    fullAddress: string
    numberOfWetStamps: number
  }

  constructor(props: CreateJobCommand) {
    this.deliverablesEmails = props.deliverablesEmails
    this.updatedByUserId = props.updatedByUserId
    this.jobNumber = props.jobNumber
    this.clientUserIds = props.clientUserIds
    this.additionalInformationFromClient = props.additionalInformationFromClient
    this.systemSize = props.systemSize
    this.projectId = props.projectId
    this.taskIds = props.taskIds
    this.otherServiceDescription = props.otherServiceDescription
    this.mailingAddressForWetStamp = props.mailingAddressForWetStamp
  }
}

// class JobResopnseDto {
//   serviceOrderId: string
//   jobFolderLink: string | null
//   jobRequestNumber: number
//   jobNumber: string | null
//   jobStatus: string //enum
//   estimatedDaysToComplete: string // 생성시 입력?
//   estimatedDaysToCompleteOverride: string | null
//   receivedAt: string | null
//   dateDue: string | null // 생성시 입력?
//   completedCancelledAt: string | null //나누기?
//   dateSentToClient: string | null
//   deliverablesEmail: string
//   additionalInformationFromClient: string
//   clientContact: string
//   clientContactEmail: string
// }

// class UpdateJobResopnseDto {
//   // serviceOrderId: string
//   // jobFolderLink: string | null
//   // jobRequestNumber: number
//   jobNumber: string | null
//   jobStatus: string //enum
//   estimatedDaysToComplete: string // 추후 자동화되면 업데이트 불가
//   estimatedDaysToCompleteOverride: string | null
//   receivedAt: string | null
//   // dateDue: string // 추후 자동 입력, 수정불가능?
//   // completedCancelledAt: string | null
//   dateSentToClient: string | null
//   deliverablesEmail: string
//   additionalInformationFromClient: string
//   clientContact: string
//   clientContactEmail: string
// }

// class JobPaginatedResponseDto {
//   items: [
//     {
//       inReview: boolean
//       priority: number
//       jobFolderLink: string
//       client: string
//       jobName: string // Address
//       jobStatus: string // enum
//       jobType: 'Commercial' | 'Residential'
//       tasks: {
//         assignedTo: string
//         name: string
//         status: string
//       }
//       recievedAt: string
//       dateDue: string
//     },
//   ]
// }
