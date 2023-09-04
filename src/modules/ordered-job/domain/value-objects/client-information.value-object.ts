import { initialize } from '../../../../libs/utils/constructor-initializer'

export class ClientInformation {
  clientOrganizationId: string
  clientOrganizationName: string
  clientContactEmail: string
  deliverablesEmail: string[]

  constructor(props: ClientInformation) {
    initialize(this, props)
  }
}
