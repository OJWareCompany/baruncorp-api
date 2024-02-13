import { initialize } from '../../../../libs/utils/constructor-initializer'
import { Address } from '../../../organization/domain/value-objects/address.vo'
import { ProjectPropertyTypeEnum } from '../../domain/project.type'
// import { ProjectAssociatedRegulatoryBody } from '../../domain/value-objects/project-associated-regulatory-body.value-object'

export class UpdateProjectCommand {
  projectId: string
  projectPropertyType: ProjectPropertyTypeEnum
  projectPropertyOwner: string | null
  projectNumber: string | null
  projectPropertyAddress: Address
  // projectAssociatedRegulatory: ProjectAssociatedRegulatoryBody
  updatedByUserId: string
  utilityId?: string
  constructor(props: UpdateProjectCommand) {
    initialize(this, props)
  }
}
