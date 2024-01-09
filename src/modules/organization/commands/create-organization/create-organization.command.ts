import { initialize } from '../../../../libs/utils/constructor-initializer'
import { ProjectPropertyTypeEnum, MountingTypeEnum } from '../../../project/domain/project.type'

export class CreateOrganizationCommand {
  readonly isVendor: boolean
  readonly phoneNumber: string | null
  readonly name: string
  // readonly description: string | null
  // readonly organizationType: string
  readonly address: {
    readonly street1: string
    readonly street2: string | null
    readonly city: string
    readonly state: string
    readonly postalCode: string
    readonly country: string | null
    readonly fullAddress: string
    readonly coordinates: number[]
  }
  // readonly isActiveContractor: boolean | null
  // readonly isActiveWorkResource: boolean | null
  // readonly isRevenueShare: boolean | null
  // readonly isRevisionRevenueShare: boolean | null
  // readonly invoiceRecipient: string | null
  readonly invoiceRecipientEmail: string | null
  readonly projectPropertyTypeDefaultValue: ProjectPropertyTypeEnum | null
  readonly mountingTypeDefaultValue: MountingTypeEnum | null
  readonly isSpecialRevisionPricing: boolean
  readonly numberOfFreeRevisionCount: number | null

  constructor(props: CreateOrganizationCommand) {
    initialize(this, props)
  }
}
