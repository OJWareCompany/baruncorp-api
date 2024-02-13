import { initialize } from '../../../../libs/utils/constructor-initializer'
import { ProjectPropertyTypeEnum } from '../../domain/project.type'

/**
 * Service와 Controller 사이의 DTO다.
 * Request DTO와 독립적이어서 어떤 Client든 해당 Command를 사용하면 Service를 사용할 수 있다.
 */
export class CreateProjectCommand {
  readonly userId: string
  readonly clientOrganizationId: string
  readonly projectPropertyType: ProjectPropertyTypeEnum
  readonly projectPropertyOwner: string | null

  readonly projectPropertyAddress: {
    readonly street1: string
    readonly street2: string | null
    readonly city: string
    readonly state: string
    readonly postalCode: string
    readonly country: string | null
    readonly fullAddress: string
    readonly coordinates: number[]
  }

  readonly projectNumber: string | null
  readonly utilityId?: string

  constructor(props: CreateProjectCommand) {
    initialize(this, props)
    this.projectPropertyAddress.coordinates[0] = Number(this.projectPropertyAddress.coordinates[0].toFixed(2))
    this.projectPropertyAddress.coordinates[1] = Number(this.projectPropertyAddress.coordinates[1].toFixed(2))
  }
}
