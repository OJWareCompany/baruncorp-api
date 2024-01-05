export interface UserNameProps {
  firstName: string
  lastName: string
}

export class UserName {
  protected readonly props: UserNameProps

  constructor(props: UserNameProps) {
    this.props = props
  }

  get firstName() {
    return this.props.firstName
  }

  get lastName() {
    return this.props.lastName
  }

  get fullName() {
    return `${this.props.firstName} ${this.props.lastName}`
  }
}
