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
    this.email = props.email
    this.fullAddress = props.fullAddress
    this.street1 = props.street1
    this.street2 = props.street2
    this.city = props.city
    this.state = props.state
    this.postalCode = props.postalCode
    this.country = props.country
    this.phoneNumber = props.phoneNumber
    this.name = props.name
    this.description = props.description
    this.organizationType = props.organizationType
    this.isActiveContractor = props.isActiveContractor
    this.isActiveWorkResource = props.isActiveWorkResource
    this.isRevenueShare = props.isRevenueShare
    this.isRevisionRevenueShare = props.isRevisionRevenueShare
    this.invoiceRecipient = props.invoiceRecipient
    this.invoiceRecipientEmail = props.invoiceRecipientEmail
  }
}