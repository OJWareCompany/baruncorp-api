/**
 * Position entity.
 */

export interface PositionProps {
  name: string
  departmentId: string
  departmentName: string
  description: string
}

export interface CreatePositionProps extends PositionProps {
  departmentId: string
}

export interface UpdatePositionProps extends PositionProps {
  departmentId: string
}

export interface DeletePositionProps {
  positionId: string
}

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
