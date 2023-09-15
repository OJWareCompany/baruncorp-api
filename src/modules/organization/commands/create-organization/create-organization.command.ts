import { initialize } from '../../../../libs/utils/constructor-initializer'

export class CreateOrganizationCommand {
  readonly email: string | null
  readonly fullAddress: string
  readonly street1: string
  readonly street2: string | null
  readonly city: string
  readonly state: string
  readonly postalCode: string
  readonly country: string
  readonly phoneNumber: string | null
  readonly name: string
  readonly description: string | null
  readonly organizationType: string
  readonly isActiveContractor: boolean | null
  readonly isActiveWorkResource: boolean | null
  readonly isRevenueShare: boolean | null
  readonly isRevisionRevenueShare: boolean | null
  readonly invoiceRecipient: string | null
  readonly invoiceRecipientEmail: string | null

  constructor(props: CreateOrganizationCommand) {
    initialize(this, props)
  }
}
