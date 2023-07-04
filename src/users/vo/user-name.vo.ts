export interface UserNameProps {
  firstName: string
  lastName: string
}

export class UserName {
  protected readonly props: UserNameProps

  constructor(props: UserNameProps) {
    this.props = props
  }

  getFirstName() {
    return this.props.firstName
  }

  getLastName() {
    return this.props.lastName
  }

  getFullName() {
    return `${this.props.firstName} ${this.props.lastName}`
  }
}
