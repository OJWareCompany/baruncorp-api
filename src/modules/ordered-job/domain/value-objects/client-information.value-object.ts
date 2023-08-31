import { initialize } from '../../../../libs/utils/constructor-initializer'

export class ClientInformation {
  clientOrganizationId: string
  clientContact: string
  clientContactEmail: string
  deliverablesEmail: string

  constructor(props: ClientInformation) {
    initialize(this, props)
  }
}
