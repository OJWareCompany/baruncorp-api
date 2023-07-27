export interface AddressProps {
  city: string
  country: string
  postalCode: string
  stateOrRegion: string
  street1: string
  street2: string
}

export class Address {
  protected readonly props: AddressProps

  constructor(props: AddressProps) {
    this.props = props
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

  get stateOrRegion() {
    return this.props.stateOrRegion
  }

  get street1() {
    return this.props.street1
  }

  get street2() {
    return this.props.street2
  }
}
