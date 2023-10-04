import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { MountingType, MountingTypeEnum, ProjectPropertyTypeEnum } from '../../project/domain/project.type'
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

  update(data: {
    email: string | null
    phoneNumber: string | null
    description: string | null
    address: {
      street1: string
      street2: string | null
      city: string
      state: string
      postalCode: string
      country: string | null
      fullAddress: string
      coordinates: number[]
    }
    projectPropertyTypeDefaultValue: ProjectPropertyTypeEnum | null
    mountingTypeDefaultValue: MountingTypeEnum | null
  }) {
    this.props.email = data.email
    this.props.phoneNumber = data.phoneNumber
    this.props.description = data.description
    this.props.address = data.address
    this.props.projectPropertyTypeDefaultValue = data.projectPropertyTypeDefaultValue
    this.props.mountingTypeDefaultValue = data.mountingTypeDefaultValue
  }

  public validate(): void {
    return
  }
}
