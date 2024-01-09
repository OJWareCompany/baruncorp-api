import { initialize } from '../../../../libs/utils/constructor-initializer'

export class CreateUserCommand {
  readonly organizationId: string
  readonly firstName: string
  readonly lastName: string
  readonly email: string
  readonly isVendor: boolean
  readonly deliverablesEmails: string[]
  readonly phoneNumber: string | null
  readonly updatedBy: string
  readonly dateOfJoining?: Date | null

  constructor(props: CreateUserCommand) {
    initialize(this, props)
  }
}
