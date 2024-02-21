import { initialize } from '../../../../libs/utils/constructor-initializer'

export class CreateGoogleAhjNoteFolderCommand {
  readonly geoId: string
  constructor(props: CreateGoogleAhjNoteFolderCommand) {
    initialize(this, props)
  }
}
