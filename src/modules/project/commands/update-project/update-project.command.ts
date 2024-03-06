import { initialize } from '../../../../libs/utils/constructor-initializer'
import { Address } from '../../../organization/domain/value-objects/address.vo'
import { ProjectPropertyTypeEnum } from '../../domain/project.type'
// import { ProjectAssociatedRegulatoryBody } from '../../domain/value-objects/project-associated-regulatory-body.value-object'

export class UpdateProjectCommand {
  readonly projectId: string
  readonly projectPropertyType: ProjectPropertyTypeEnum
  readonly systemSize?: number | null
  readonly projectPropertyOwner: string | null
  readonly projectNumber: string | null
  readonly projectPropertyAddress: Address
  // readonly projectAssociatedRegulatory: ProjectAssociatedRegulatoryBody
  readonly updatedByUserId: string
  readonly utilityId?: string
  constructor(props: UpdateProjectCommand) {
    initialize(this, props)
  }
}
