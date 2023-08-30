export class CreateOrganizationCommand {
  readonly email: string
  readonly fullAddress: string
  readonly street1: string
  readonly street2: string
  readonly city: string
  readonly state: string
  readonly postalCode: string
  readonly country: string
  readonly phoneNumber: string
  readonly name: string
  readonly description: string
  readonly organizationType: string
  readonly isActiveContractor: boolean | null
  readonly isActiveWorkResource: boolean | null
  readonly isRevenueShare: boolean | null
  readonly isRevisionRevenueShare: boolean | null
  readonly invoiceRecipient: string | null
  readonly invoiceRecipientEmail: string | null

  constructor(props: CreateOrganizationCommand) {
    Object.entries(props).map(([key, value]) => (this[key] = value))
  }
}
