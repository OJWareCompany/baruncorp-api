import { initialize } from '../../../libs/utils/constructor-initializer'

export class SignUpCommand {
  readonly userId: string
  readonly email: string
  readonly firstName: string
  readonly lastName: string
  readonly deliverablesEmails: string[]
  readonly password: string
  readonly phoneNumber: string
  constructor(props: SignUpCommand) {
    initialize(this, props)
  }
}
