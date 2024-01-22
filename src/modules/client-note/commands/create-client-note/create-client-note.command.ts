import { initialize } from '../../../../libs/utils/constructor-initializer'

export class CreateClientNoteCommand {
  readonly organizationId: string
  readonly designNotes: string
  readonly electricalEngineeringNotes: string
  readonly structuralEngineeringNotes: string
  readonly updatedBy: string
  constructor(props: CreateClientNoteCommand) {
    initialize(this, props)
  }
}
