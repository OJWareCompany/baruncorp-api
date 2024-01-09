import { initialize } from '../../../../libs/utils/constructor-initializer'
import { Address } from '../../../organization/domain/value-objects/address.vo'
import { MountingTypeEnum } from '../../../project/domain/project.type'
import { LoadCalcOriginEnum } from '../../domain/job.type'
import { CreateOrderedTaskWhenJobIsCreatedRequestDto } from './create-job.request.dto'

export class CreateJobCommand {
  readonly deliverablesEmails: string[]
  readonly updatedByUserId: string
  readonly clientUserId: string
  readonly additionalInformationFromClient: string | null
  readonly systemSize: number | null // Job 단위로 청구되며, 가격이 있기에 Size도 Job에 있어야 하지 않을까? (전체 사이즈는 프로젝트 하나라고하더라도..)
  readonly projectId: string
  readonly orderedTasks: CreateOrderedTaskWhenJobIsCreatedRequestDto[] // 주문받은 태스크는 내부에서 실제 수행되는 여러가지 태스크들로 쪼개진다.
  readonly mailingAddressForWetStamp: Address | null
  readonly numberOfWetStamp: number | null
  readonly mountingType: MountingTypeEnum
  readonly isExpedited: boolean
  readonly loadCalcOrigin: LoadCalcOriginEnum

  constructor(props: CreateJobCommand) {
    initialize(this, props)
  }
}
