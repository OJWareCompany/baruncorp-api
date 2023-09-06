import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { CreateOrganizationProps, OrganizationProps } from './organization.types'
import { v4 } from 'uuid'
export class OrganizationEntity extends AggregateRoot<OrganizationProps> {
  protected _id: string

  static create(create: CreateOrganizationProps) {
    const id = v4()
    const props: OrganizationProps = {
      ...create,
    }
    return new OrganizationEntity({ id, props })
  }

  public validate(): void {
    const result = 1 + 1
  }
}
