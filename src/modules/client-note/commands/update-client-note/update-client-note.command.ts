import { initialize } from '../../../../libs/utils/constructor-initializer'

export class UpdateClientNoteCommand {
  readonly clientNoteId: string
  readonly designNotes: string
  readonly electricalEngineeringNotes: string
  readonly structuralEngineeringNotes: string
  readonly updatedBy: string
  constructor(props: UpdateClientNoteCommand) {
    initialize(this, props)
  }
}
