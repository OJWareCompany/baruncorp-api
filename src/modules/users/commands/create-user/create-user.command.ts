import { initialize } from '../../../../libs/utils/constructor-initializer'

export class CreateUserCommand {
  readonly organizationId: string
  readonly firstName: string
  readonly lastName: string
  readonly email: string
  readonly deliverablesEmails: string[]
  readonly phoneNumber: string
  readonly updatedBy: string

  constructor(props: CreateUserCommand) {
    initialize(this, props)
  }
}
