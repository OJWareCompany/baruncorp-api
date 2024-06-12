import { initialize } from '../../../../libs/utils/constructor-initializer'
import { ProjectAssociatedRegulatoryBody } from '../../domain/value-objects/project-associated-regulatory-body.value-object'
// import { ProjectAssociatedRegulatoryBody } from '../../domain/value-objects/project-associated-regulatory-body.value-object'

export class UpdateProjectAssociatedRegulatoryCommand {
  readonly projectId: string
  readonly projectAssociatedRegulatory: ProjectAssociatedRegulatoryBody
  readonly updatedByUserId: string
  constructor(props: UpdateProjectAssociatedRegulatoryCommand) {
    initialize(this, props)
  }
}
