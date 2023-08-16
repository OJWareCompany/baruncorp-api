import { CreateOrganizationProps, OrganizationProps } from './organization.types'
import { v4 } from 'uuid'
export class OrganizationEntity {
  id: string
  protected readonly props: OrganizationProps

  static create(create: CreateOrganizationProps) {
    const id = v4()
    const props: OrganizationProps = {
      ...create,
    }
    return new OrganizationEntity({ id, props })
  }

  constructor({ id, props }: { id: string; props: CreateOrganizationProps }) {
    this.id = id
    this.props = props
  }

  getProps() {
    const copyProps = {
      id: this.id,
      ...this.props,
      isActiveContractor: !!this.getProps().isActiveContractor,
      isActiveWorkResource: !!this.getProps().isActiveWorkResource,
      revenueShare: !!this.getProps().revenueShare,
      revisionRevenueShare: !!this.getProps().revisionRevenueShare,
    }
    return Object.freeze(copyProps)
  }
}
