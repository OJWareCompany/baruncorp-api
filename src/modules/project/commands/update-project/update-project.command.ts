import { initialize } from '../../../../libs/utils/constructor-initializer'
import { Address } from '../../../organization/domain/value-objects/address.vo'
import { ProjectPropertyType } from '../../domain/project.type'
import { ProjectAssociatedRegulatoryBody } from '../../domain/value-objects/project-associated-regulatory-body.value-object'

export class UpdateProjectCommand {
  projectId: string
  projectPropertyType: ProjectPropertyType
  projectPropertyOwner: string | null
  projectNumber: string | null
  projectPropertyAddress: Address
  projectAssociatedRegulatory: ProjectAssociatedRegulatoryBody
  updatedByUserId: string
  constructor(props: UpdateProjectCommand) {
    initialize(this, props)
  }
}
