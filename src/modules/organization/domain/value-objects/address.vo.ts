import { initialize } from '../../../../libs/utils/constructor-initializer'

export interface AddressProps {
  city: string
  country: string | null
  postalCode: string
  state: string | null
  street1: string
  street2: string | null
  fullAddress: string
  coordinates: number[]
}

export class Address {
  readonly street1: string
  readonly street2: string | null
  readonly city: string
  readonly state: string
  readonly postalCode: string
  readonly country: string | null
  readonly fullAddress: string
  readonly coordinates: number[]

  constructor(props: AddressProps) {
    initialize(this, props)
  }
}
