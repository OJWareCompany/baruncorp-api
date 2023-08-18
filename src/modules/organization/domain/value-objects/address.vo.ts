export interface AddressProps {
  city: string
  country: string
  postalCode: string
  state: string
  street1: string
  street2: string
  fullAddress: string
}

export class Address {
  protected readonly props: AddressProps

  constructor(props: AddressProps) {
    this.props = props
  }

  get fullAddress() {
    return this.fullAddress
  }

  get city() {
    return this.props.city
  }

  get country() {
    return this.props.country
  }

  get postalCode() {
    return this.props.postalCode
  }

  get state() {
    return this.props.state
  }

  get street1() {
    return this.props.street1
  }

  get street2() {
    return this.props.street2
  }
}
