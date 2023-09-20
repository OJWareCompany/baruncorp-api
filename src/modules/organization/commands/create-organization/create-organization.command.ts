import { initialize } from '../../../../libs/utils/constructor-initializer'

export class CreateOrganizationCommand {
  readonly email: string | null
  readonly phoneNumber: string | null
  readonly name: string
  readonly description: string | null
  readonly organizationType: string
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
  // readonly invoiceRecipientEmail: string | null
  readonly projectPropertyTypeDefaultValue: string | null
  readonly mountingTypeDefaultValue: string | null

  constructor(props: CreateOrganizationCommand) {
    initialize(this, props)
  }
}
