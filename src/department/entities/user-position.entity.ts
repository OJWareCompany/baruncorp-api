import { CreateUserPositionProps, UserPositionProps } from '../interfaces/position.interface'
import { v4 } from 'uuid'

export class UserPositionEntity implements UserPositionProps {
  positionId: string
  userId: string

  static create(create: CreateUserPositionProps) {
    return new UserPositionEntity({ ...create })
  }

  // Use when convert record to entity in repository.
  constructor(props: UserPositionEntity) {
    this.positionId = props.positionId
    this.userId = props.userId
  }
}
