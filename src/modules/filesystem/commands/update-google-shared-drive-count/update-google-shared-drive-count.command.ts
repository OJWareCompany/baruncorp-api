import { initialize } from '../../../../libs/utils/constructor-initializer'

export class UpdateGoogleSharedDriveCountCommand {
  readonly jobFolderId: string
  readonly count: number
  constructor(props: UpdateGoogleSharedDriveCountCommand) {
    initialize(this, props)
  }
}
