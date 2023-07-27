/**
 * User position entity.
 */

export interface UserPositionProps {
  positionId: string
  userId: string
}

export interface CreateUserPositionProps {
  positionId: string
  userId: string
}

export interface DeleteUserPositionProps {
  positionId: string
  userId: string
}

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
