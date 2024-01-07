import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { MountingTypeEnum, ProjectPropertyTypeEnum } from '../../project/domain/project.type'
import { CreateOrganizationProps, OrganizationProps } from './organization.types'
import { v4 } from 'uuid'
export class OrganizationEntity extends AggregateRoot<OrganizationProps> {
  protected _id: string

  static create(create: CreateOrganizationProps) {
    const id = v4()
    const props: OrganizationProps = {
      ...create,
      organizationType: 'client',
      isDelinquent: false,
    }
    return new OrganizationEntity({ id, props })
  }

  get name() {
    return this.props.name
  }

  get numberOfFreeRevisionCount() {
    return this.props.numberOfFreeRevisionCount
  }

  get isSpecialRevisionPricing() {
    return this.props.isSpecialRevisionPricing
  }

  update(data: {
    email: string | null
    isVendor: boolean
    isDelinquent: boolean
    phoneNumber: string | null
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
    isSpecialRevisionPricing: boolean
    numberOfFreeRevisionCount: number | null
  }) {
    this.props.email = data.email
    this.props.isVendor = data.isVendor
    this.props.isDelinquent = data.isDelinquent
    this.props.phoneNumber = data.phoneNumber
    // this.props.description = data.description
    this.props.address = data.address
    this.props.projectPropertyTypeDefaultValue = data.projectPropertyTypeDefaultValue
    this.props.mountingTypeDefaultValue = data.mountingTypeDefaultValue
    this.props.isSpecialRevisionPricing = data.isSpecialRevisionPricing
    this.props.numberOfFreeRevisionCount = data.numberOfFreeRevisionCount
  }

  public validate(): void {
    return
  }
}
