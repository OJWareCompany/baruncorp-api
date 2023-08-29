import { MountingType, ProjectPropertyType } from '../../domain/project.type'

/**
 * Service와 Controller 사이의 DTO다.
 * Request DTO와 독립적이어서 어떤 Client든 해당 Command를 사용하면 Service를 사용할 수 있다.
 */
export class CreateProjectCommand {
  userId: string

  organizationId: string

  projectPropertyType: ProjectPropertyType

  projectPropertyOwner: string

  projectPropertyAddress: {
    street1: string
    street2: string | null
    city: string
    state: string
    postalCode: string
    country: string | null
    fullAddress: string
  }

  projectNumber: string | null

  constructor(props: CreateProjectCommand) {
    Object.entries(props).map(([key, value]) => (this[key] = value))
  }
}
