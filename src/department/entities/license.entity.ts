import { LicenseProps } from '../interfaces/license.interface'

export class LicenseEntity {
  protected readonly props: LicenseProps

  constructor(props: LicenseProps) {
    this.props = props
  }

  getProps(): LicenseProps {
    const propsCopy = {
      ...this.props,
    }
    return Object.freeze(propsCopy)
  }
}