import { ProjectPropertyType } from '../../domain/project.type'

/**
 * Service와 Controller 사이의 DTO다.
 * Request DTO와 독립적이어서 어떤 Client든 해당 Command를 사용하면 Service를 사용할 수 있다.
 */
export class CreateProjectCommand {
  readonly userId: string

  readonly clientOrganizationId: string

  readonly projectPropertyType: ProjectPropertyType

  readonly projectPropertyOwner: string | null

  readonly projectPropertyAddress: {
    readonly street1: string
    readonly street2: string | null
    readonly city: string
    readonly state: string
    readonly postalCode: string
    readonly country: string | null
    readonly fullAddress: string
  }

  readonly projectNumber: string | null

  readonly coordinates: number[]

  constructor(props: CreateProjectCommand) {
    Object.entries(props).map(([key, value]) => (this[key] = value))
  }
}
