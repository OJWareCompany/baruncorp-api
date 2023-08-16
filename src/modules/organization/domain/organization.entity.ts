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
      isActiveContractor: !!this.props.isActiveContractor,
      isActiveWorkResource: !!this.props.isActiveWorkResource,
      revenueShare: !!this.props.isRevenueShare,
      revisionRevenueShare: !!this.props.isRevisionRevenueShare,
    }
    return Object.freeze(copyProps)
  }
}
