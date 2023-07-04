import { v4 } from 'uuid'
import { CreateUserProps, UserProps } from '../interfaces/user.interface'

// where should it be 'id'? Entity or Prop?
// 'id' should be in base entity
export class UserEntity {
  readonly id?: string
  protected readonly props: UserProps
  /**
   * readonly email: string
   * readonly userName: UserName
   * readonly password: string
   * readonly organizationId: string
   */

  static create(create: CreateUserProps): UserEntity {
    const id = v4()
    const props: UserProps = { ...create }
    return new UserEntity({ id, props })
  }

  constructor({ id, props }: { id: any; props: CreateUserProps }) {
    this.id = id
    this.props = props
  }

  getProps(): UserProps & { id: string } {
    const propsCopy = {
      id: this.id,
      ...this.props,
    }
    return Object.freeze(propsCopy)
  }
}
