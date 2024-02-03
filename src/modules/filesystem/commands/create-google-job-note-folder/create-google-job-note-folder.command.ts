import { initialize } from '../../../../libs/utils/constructor-initializer'

export class CreateGoogleJobNoteFolderCommand {
  readonly folderId: string
  readonly shareLink: string
  readonly jobNotesFolderId: string
  readonly jobNoteId: string
  readonly sharedDriveId: string
  constructor(props: CreateGoogleJobNoteFolderCommand) {
    initialize(this, props)
  }
}
