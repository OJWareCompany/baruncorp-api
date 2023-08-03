export class CreateOrganizationCommand {
  readonly email: string
  readonly street1: string
  readonly street2: string
  readonly city: string
  readonly stateOrRegion: string
  readonly postalCode: string
  readonly country: string
  readonly phoneNumber: string
  readonly name: string
  readonly description: string
  readonly organizationType: string

  constructor(props: CreateOrganizationCommand) {
    this.email = props.email
    this.street1 = props.street1
    this.street2 = props.street2
    this.city = props.city
    this.stateOrRegion = props.stateOrRegion
    this.postalCode = props.postalCode
    this.country = props.country
    this.phoneNumber = props.phoneNumber
    this.name = props.name
    this.description = props.description
    this.organizationType = props.organizationType
  }
}
