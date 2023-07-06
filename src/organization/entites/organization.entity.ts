import { CreateOrganizationProps, OrganizationProps } from '../interfaces/organization.interface'
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
    }
    return Object.freeze(copyProps)
  }
}