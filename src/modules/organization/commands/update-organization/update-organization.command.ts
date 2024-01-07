import { initialize } from '../../../../libs/utils/constructor-initializer'
import { MountingTypeEnum, ProjectPropertyTypeEnum } from '../../../project/domain/project.type'

export class UpdateOrganizationCommand {
  readonly organizationId: string
  readonly email: string | null
  readonly isVendor: boolean
  readonly isDelinquent: boolean
  readonly phoneNumber: string | null
  readonly address: {
    readonly street1: string
    readonly street2: string | null
    readonly city: string
    readonly state: string
    readonly postalCode: string
    readonly country: string | null
    readonly fullAddress: string
    readonly coordinates: number[]
  }
  readonly projectPropertyTypeDefaultValue: ProjectPropertyTypeEnum | null
  readonly mountingTypeDefaultValue: MountingTypeEnum | null
  readonly isSpecialRevisionPricing: boolean
  readonly numberOfFreeRevisionCount: number | null

  constructor(props: UpdateOrganizationCommand) {
    initialize(this, props)
  }
}
