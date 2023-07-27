import { v4 } from 'uuid'

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

export class PositionEntity {
  id?: string
  protected readonly props: PositionProps

  static create(create: CreatePositionProps) {
    const id = v4()
    const props: PositionProps = { ...create }
    return new PositionEntity({ id, props })
  }

  constructor({ id, props }: { id: string; props: CreatePositionProps }) {
    this.id = id
    this.props = props
  }

  getProps(): PositionProps & { id: string } {
    const propsCopy = {
      id: this.id,
      ...this.props,
    }
    return Object.freeze(propsCopy)
  }
}
