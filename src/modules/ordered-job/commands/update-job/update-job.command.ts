import { initialize } from '../../../../libs/utils/constructor-initializer'
import { Address } from '../../../organization/domain/value-objects/address.vo'
import { MountingTypeEnum } from '../../../project/domain/project.type'
import { LoadCalcOriginEnum } from '../../domain/job.type'
import { OrderedJobsPriorityEnum } from '../../domain/value-objects/priority.value-object'

export class UpdateJobCommand {
  readonly jobId: string
  readonly systemSize: number | null // Job 단위로 청구되며, 가격이 있기에 Size도 Job에 있어야 하지 않을까? (전체 사이즈는 프로젝트 하나라고하더라도..)
  readonly mailingAddressForWetStamp: Address | null
  readonly deliverablesEmails: string[]
  readonly clientUserId: string
  readonly additionalInformationFromClient: string | null
  readonly numberOfWetStamp: number | null
  readonly editorUserId: string
  readonly mountingType?: MountingTypeEnum | null
  readonly structuralUpgradeNote: string | null
  readonly isExpedited: boolean
  readonly dueDate: Date
  readonly inReview: boolean
  readonly priority: OrderedJobsPriorityEnum
  readonly loadCalcOrigin: LoadCalcOriginEnum

  constructor(props: UpdateJobCommand) {
    initialize(this, props)
  }
}
